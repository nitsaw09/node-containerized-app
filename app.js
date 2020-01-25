const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();

const productRoutes = require("./api/routes/products");

app.use(morgan("dev"));

app.use("/products", productRoutes);

// handling 404 error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// handling 404 & 500 error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status: error.status || 500,
    error: {
      message: error.message
    }
  });
  next();
});

// connecting to mongoDB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("DB connected");
});

module.exports = app;
