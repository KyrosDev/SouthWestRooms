const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

/* APPLICATION CONFIG */
const app = express();

app.use(express.json()); // Parse requests
app.use(helmet());
app.use(
  cors({
    allowedHeaders: process.env.CORS || "https://localhost:8080/", // Allow hosts
  })
);
app.use(morgan("dev")); // Display requests into console

/* ROUTES */
app.get("/", (req, res) => {
  res.json("Hello World! ✨");
});

/* ROOMS ROUTES */
app.use("/api/v1/rooms/", require("./routes/rooms.routes"));
app.use("/api/v1/payments/", require("./routes/payments.routes"));

/* MIDDLEWARES */
const middlewares = require("./middlewares");

app.use(middlewares.errorHandler); // Send Error
app.use(middlewares.notFound); // Send 404 error if route doesn't exists

/* RUN APPLICATION */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}. ✨`);
});