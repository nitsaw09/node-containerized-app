const express = require("express");
const mongoose = require("mongoose");

const app = express();

const productRoutes = require("./api/routes/products");

app.use("/products", productRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Rest API");
});

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("DB connected");
});

module.exports = app;
