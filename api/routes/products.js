const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product");

const router = express.Router();

router.get("/", (req, res) => {
  Product.find()
    .select("_id name description price")
    .sort({ createdAt: "desc" })
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
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        data: {
          _id: result._id,
          name: result.name,
          description: result.description,
          price: result.price
        },
        message: "Product created successfully"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:productId", (req, res) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("_id name description price")
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "No Data Found"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/:productId", (req, res) => {
  const id = req.params.productId;
  Product.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        result,
        message: "Product updated successfully"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:productId", (req, res) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        result,
        message: "Product deleted successfully"
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
