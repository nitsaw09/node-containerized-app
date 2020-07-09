const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.get("/verify", authController.verify);

router.post("/reverify", authController.reverify);

module.exports = router;
