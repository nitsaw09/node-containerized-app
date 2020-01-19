const express = require("express");
const Mongo = require("mongoose");

const app = express();

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

Mongo.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log(`DB connected`);
});

// start listening the server at port 3000
app.listen(3000);
