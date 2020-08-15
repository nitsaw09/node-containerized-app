import _ from "lodash";

const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const pagination = require("../utils/pagination");
const sortData = require("../utils/sortData");
const filterData = require("../utils/filterData");

const productCheck = products => {
  const productIds = [];
  _.forEach(products, el => {
    productIds.push(el.product);
  });

  return Product.find({ _id: { $in: productIds } })
    .exec()
    .then(docs => {
      if (productIds.length !== docs.length) {
        const err = { message: "Product not found" };
        return Promise.reject(err);
      }
      return true;
    });
};

exports.getAllOrders = async (req, res) => {
  const filter = await filterData(req.query);
  const totalRecords = await Order.find(filter).countDocuments(); // total order records
  if (totalRecords > 0) {
    const sortColumn = await sortData(req.query);
    const paginate = await pagination(req.query, totalRecords);

    Order.find(filter)
      .populate({ path: "products.product", select: "_id name description price" })
      .sort(sortColumn)
      .offset(paginate.offset)
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
  }
};

exports.createOrder = (req, res) => {
  const { products, status } = req.body;
  productCheck(products)
    .then(() => {
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        products,
        status
      });
      return order.save().then(result => {
        console.log(result);
        res.status(200).json({
          result,
          message: "Order created successfully"
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.getOrderDetails = (req, res) => {
  const id = req.params.orderId;
  Order.findById(id)
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

exports.deleteOrder = (req, res) => {
  const id = req.params.orderId;
  Order.deleteOne({ _id: id })
    .exec()
    .then(result => {
      console.log(result);
      if (result.deletedCount !== 0) {
        res.status(200).json({
          message: "Order deleted successfully"
        });
      } else {
        res.status(200).json({
          message: "Invalid order"
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

exports.addOrderProduct = async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  productCheck(req.body)
    .then(() => {
      order.products.push(req.body);
      return order.save().then(result => {
        console.log(result);
        res.status(200).json({
          result,
          message: "product added to order successfully"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });

  order.products = req.body;
  order.updatedAt = Date.now();

  order
    .save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        result,
        message: "order updated successfully",
        product_count: result.products.length
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.deleteOrderProduct = async (req, res) => {
  const { orderId, productId } = req.params;
  const order = await Order.findOne({ _id: orderId });

  order.products = _.remove(order.products, e => e.product.toString() !== productId);
  order.updatedAt = Date.now();

  order
    .save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        result,
        message: "product deleted from order successfully",
        product_count: result.products.length
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
