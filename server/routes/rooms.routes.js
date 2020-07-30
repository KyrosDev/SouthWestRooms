const { Router } = require("express");
const router = Router();
const Joi = require("@hapi/joi");
const db = require("monk")("localhost/southwestrooms");

function createShortcode(len) {
  const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
  let result = "";
  for (let i = 0; i < len; i++) {
    result = result + a[Math.floor(Math.random() * a.length + 1)];
  }
  return result;
}

const roomModel = Joi.object().keys({
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
  shortcode: Joi.string().required(),
});

const rooms = db.get("rooms");

/* GET ALL ROOMS */
router.get("/", (req, res, next) => {
  rooms
    .find()
    .then((room) => {
      res.json(room);
    })
    .catch((e) => {
      next(e);
    });
});

/* GET ROOM BY ID */
router.get("/:shortcode", (req, res, next) => {
  const shortcode = req.params.shortcode;
  rooms
    .findOne({ shortcode })
    .then((room) => {
      if (room !== null) {
        res.json(room);
      } else {
        res.json({ message: `Room with shortcode '${shortcode}' not found` });
      }
    })
    .catch((e) => {
      next(e);
    });
});

/* CREATE NEW ROOM */
router.post("/", (req, res, next) => {
  const room = req.body;
  const shortcode = createShortcode(8);
  room.shortcode = shortcode;
  const result = Joi.validate(room, roomModel);
  if (result.error) {
    next(result.error);
  } else {
    rooms
      .insert(room)
      .then((newRoom) => {
        res.json(newRoom);
      })
      .catch((e) => {
        next(e);
      });
  }
});

module.exports = router;
