const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Handling get request of products route"
  });
});

router.post("/", (req, res) => {
  res.status(200).json({
    message: "Handling post request of products route"
  });
});

router.get("/:productId", (req, res) => {
  const id = req.params.productId;
  res.status(200).json({
    message: `Handling get product ${id} in response`
  });
});

router.patch("/:productId", (req, res) => {
  const id = req.params.productId;
  res.status(200).json({
    message: `Handling patch product ${id} in response`
  });
});

router.delete("/:productId", (req, res) => {
  const id = req.params.productId;
  res.status(200).json({
    message: `Handling delete product ${id} in response`
  });
});

module.exports = router;
