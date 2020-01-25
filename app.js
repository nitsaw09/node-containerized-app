const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();

const productRoutes = require("./api/routes/products");

app.use(morgan("dev"));

app.use("/products", productRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  res.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status = error.status || 500;
  res.json({
    message: error.message
  });
  next();
});

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("DB connected");
});

module.exports = app;
