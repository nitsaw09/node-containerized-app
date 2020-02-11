import _ from "lodash";

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

router.get("/:orderId", (req, res) => {
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
});

router.delete("/:orderId", (req, res) => {
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
});

router.post("/:orderId/add-product", async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });

  order.products.push(req.body);

  order
    .save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        result,
        message: "product added to order successfully"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/:orderId", async (req, res) => {
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
});

router.delete("/:orderId/product/:productId", async (req, res) => {
  const { orderId, productId } = req.params;
  const order = await Order.findOne({ _id: orderId });

  order.products = _.remove(order.products, e => e.productId.toString() !== productId);
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
});

module.exports = router;
