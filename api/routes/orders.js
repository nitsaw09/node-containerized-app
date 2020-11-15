const express = require("express");
const orderController = require("../controllers/orderController");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/list", checkAuth, orderController.getAllOrders);

router.post("/create", checkAuth, orderController.createOrder);

router.get("/:orderId", checkAuth, orderController.getOrderDetails);

router.delete("/:orderId", checkAuth, orderController.deleteOrder);

router.post("/:orderId/add-product", checkAuth, orderController.addOrderProduct);

router.patch("/:orderId", checkAuth, orderController.updateOrder);

router.delete("/:orderId/product/:productId", checkAuth, orderController.deleteOrderProduct);

module.exports = router;
