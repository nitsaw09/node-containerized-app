const mongoose = require("mongoose");
const Product = require("../models/product");

exports.getAllProducts = (req, res) => {
  Product.find()
    .select("_id name description price productImage")
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
};

exports.addProduct = (req, res) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    productImage: req.file.path
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
          price: result.price,
          productImage: result.productImage
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
};

exports.getProductDetails = (req, res) => {
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
};

exports.updateProduct = (req, res) => {
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
};

exports.deleteProduct = (req, res) => {
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
};
