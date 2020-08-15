const express = require("express");
const uploadFile = require("../utils/upload");
const productController = require("../controllers/productController");
const checkAuth = require("../middleware/check-auth");

const upload = uploadFile({
  destination: "./uploads/products/",
  fileSize: 1024 * 1024 * 2, // upload file size limit to 2 MB
  allowedFiles: ["image/png", "image/jpeg"] // allowed upload file types
});

const router = express.Router();

router.get("/", productController.getAllProducts);

router.post("/", checkAuth, upload.single("productImage"), productController.createProduct);

router.get("/:productId", productController.getProductDetails);

router.patch("/:productId", checkAuth, productController.updateProduct);

router.delete("/:productId", checkAuth, productController.deleteProduct);

module.exports = router;
