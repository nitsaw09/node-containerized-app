const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const mail = require("../functions/mail");

const router = express.Router();

router.post("/signup", (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          error: "Email already exist"
        });
      }

      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          email: req.body.email,
          password: hash
        });

        newUser
          .save()
          .then(result => {
            console.log(result);
            mail({
              from: "niteshghuge619@gmail.com",
              to: result.email,
              subject: "Welcome user",
              template: "verify_user",
              context: {
                name: result.name,
                verifyUrl: `${req.protocol}://${req.headers.host}?email=${result.email}`
              }
            });
            res.status(200).json({ message: "Signup successfully" });
          })
          .catch(error => {
            res.status(500).json({
              error
            });
          });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
