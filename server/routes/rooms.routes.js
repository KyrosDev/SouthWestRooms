const { Router } = require("express");
const router = Router();
const Joi = require("@hapi/joi");
const db = require("monk")("localhost/southwestrooms");

function createShortcode(len) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789"; // Available chars
  let result = ""; // Shortcode
  for (let i = 0; i < len; i++) {
    result = result + chars[Math.floor(Math.random() * chars.length + 1)]; // Get random char and put it into result
  }
  return result; // Return shortcode
}

const roomModel = Joi.object().keys({
  shortcode: Joi.string().required(),
  room_name: Joi.string().required(),
  small_description: Joi.string().max(100).required(),
  long_description: Joi.string().required(),
  price_per_night: Joi.number().required(),
  square_meters: Joi.string().required(),
  maps_link: Joi.string().optional().allow(""),
  apartment_hero: Joi.string().required(),
  image_slider: Joi.array().items(
    Joi.object().keys({
      image_link: Joi.string().required(),
      alt: Joi.string().optional().allow(""),
    })
  ),
  amenities: Joi.object().keys({
    "12": Joi.boolean().required(),
    "11": Joi.boolean().required(),
    "10": Joi.boolean().required(),
    "9": Joi.boolean().required(),
    "8": Joi.boolean().required(),
    "7": Joi.boolean().required(),
    "6": Joi.boolean().required(),
    "5": Joi.boolean().required(),
    "4": Joi.boolean().required(),
    "3": Joi.boolean().required(),
    "2": Joi.boolean().required(),
    "1": Joi.boolean().required(),
  }),
});

const rooms = db.get("rooms");

/* GET ALL ROOMS */
router.get("/", (req, res, next) => {
  rooms
    .find() // Get all rooms
    .then((room) => {
      res.json(room); // Send array with rooms
    })
    .catch((e) => {
      next(e); // Send Error
    });
});

/* GET ROOM BY ID */
router.get("/:shortcode", (req, res, next) => {
  const shortcode = req.params.shortcode; // Get shortcode from params
  rooms
    .findOne({ shortcode }) // Check if item with that shortcode exists
    .then((room) => {
      if (room !== null) {
        res.json(room); // If item exist respond with room
      } else {
        res.json({ message: `Room with shortcode '${shortcode}' not found` }); // If item doesn't exists responde with error
      }
    })
    .catch((e) => {
      next(e); // Send Error
    });
});

/* CREATE NEW ROOM */
router.post("/", (req, res, next) => {
  const room = req.body; //  Get context of the request
  const shortcode = createShortcode(8); // Create a shortcode
  room.shortcode = shortcode; // Add shortcode to body
  const result = Joi.validate(room, roomModel); // Validate body
  if (result.error) {
    next(result.error); // Send Error
  } else {
    rooms
      .insert(room) // Insert new room into DB
      .then((newRoom) => {
        res.json(newRoom); // Response with the room
      })
      .catch((e) => {
        next(e); // Send Error
      });
  }
});

module.exports = router;
