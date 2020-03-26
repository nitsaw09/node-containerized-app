const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Token = require("../models/token");
const mail = require("../functions/mail");

const router = express.Router();

const userToken = (userId, token, mailOptions) => {
  const newToken = new Token({
    _id: new mongoose.Types.ObjectId(),
    token,
    user: userId
  });

  return newToken
    .save()
    .then(() => mail(mailOptions))
    .catch(err => Promise.reject(err));
};

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
            const token = Math.floor(100000 + Math.random() * 900000);
            const mailOptions = {
              from: "niteshghuge619@gmail.com",
              to: result.email,
              subject: "Welcome user",
              template: "verify_user",
              context: {
                name: result.name,
                verifyUrl: `${req.protocol}://${req.headers.host}/users/verify?token=${token}&email=${result.email}&status=1`
              }
            };
            userToken(result._id, token, mailOptions);
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

router.get("/verify", (req, res) => {
  Token.findOne({ token: req.query.token })
    .populate({ path: "user" })
    .then(doc => {
      if (doc.user.email !== req.query.email) {
        return res.status(404).json({ message: "Email not found" });
      }

      if (doc.user.verified) {
        return res.status(200).json({ message: "Email is already verified" });
      }

      User.findOne({ email: req.query.email }).then(user => {
        user.verified = true;
        user.updateAt = Date.now();
        user.save().then(() => {
          res.status(200).json({ message: "Thank you for verifying your email!!!" });
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
