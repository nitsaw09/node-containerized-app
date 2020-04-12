const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

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

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate({ path: "products.product", select: "_id name description price" })
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
      res.status(200).json({
        result,
        message: "Order deleted successfully"
      });
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
        message: "product added to order successfully",
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
