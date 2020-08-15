const mongoose = require("mongoose");
const Product = require("../models/product");
const pagination = require("../utils/pagination");
const sortData = require("../utils/sortData");
const filterData = require("../utils/filterData");

exports.getAllProducts = async (req, res) => {
  const filter = await filterData(req.query);
  const totalRecords = await Product.find(filter).countDocuments(); // total product records
  console.log(totalRecords);
  if (totalRecords > 0) {
    const sortColumn = await sortData(req.query);
    const paginate = await pagination(req.query, totalRecords);

    Product.find(filter)
      .select("_id name description price productImage")
      .sort(sortColumn)
      .skip(paginate.offset)
      .limit(paginate.limit)
      .exec()
      .then(docs => {
        console.log(docs);
        if (docs.length > 0) {
          res.status(200).json({
            from: paginate.from,
            to: paginate.to,
            currentPage: paginate.currentPage,
            totalPages: paginate.totalPages,
            totalRecords,
            data: docs
          });
        } else {
          res.status(404).json({
            error: "No Data Found"
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  } else {
    res.status(404).json({
      error: "No Data Found"
    });
  }
};

exports.createProduct = (req, res) => {
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
      if (result.nModified !== 0) {
        res.status(200).json({
          message: "Product updated successfully"
        });
      } else {
        res.status(200).json({
          message: "Invalid product"
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

exports.deleteProduct = (req, res) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
      console.log(result);
      if (result.deletedCount !== 0) {
        res.status(200).json({
          message: "Product deleted successfully"
        });
      } else {
        res.status(200).json({
          message: "Invalid product"
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
