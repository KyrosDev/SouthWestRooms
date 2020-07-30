const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

/* APPLICATION CONFIG */
const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

/* ROUTES */
app.get("/", (req, res) => {
  res.json("Hello World! ✨");
});

/* ROOMS ROUTES */
app.use("/api/v1/rooms/", require("./routes/rooms.routes"));

/* MIDDLEWARES */
const middlewares = require("./middlewares");

app.use(middlewares.errorHandler);
app.use(middlewares.notFound);

/* RUN APPLICATION */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}. ✨`);
});
