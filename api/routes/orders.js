const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/orders");

const router = express.Router();

router.get("/", (req, res) => {
  Order.find()
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json({
        count: docs.length,
        data: docs
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res) => {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    products: req.body.products,
    status: req.body.status
  });
  order
    .save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        result,
        message: "Order created successfully"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
