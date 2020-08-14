const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Token = require("../models/token");
const mail = require("../functions/mail");

const verifyToken = Math.floor(100000 + Math.random() * 900000);

const userToken = (userId, mailOptions) => {
  const newToken = new Token({
    _id: new mongoose.Types.ObjectId(),
    verifyToken,
    user: userId
  });

  return newToken
    .save()
    .then(() => mail(mailOptions))
    .catch(err => err);
};

exports.signup = (req, res) => {
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
            const mailOptions = {
              from: process.env.MAIL_EMAIL,
              to: result.email,
              subject: "Welcome user",
              template: "verify-user",
              context: {
                name: result.name,
                verifyUrl: `${req.protocol}://${req.headers.host}/users/verify?token=${verifyToken}&email=${result.email}&status=1`
              }
            };
            userToken(result._id, mailOptions);
            res.status(200).json({
              message: "Signup successfully"
            });
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
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user.email) {
        return res.status(401).json({ message: "Email or Password is in correct" });
      }

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({ message: "Email or Password is in correct" });
        }

        if (result) {
          const token = jwt.sign(
            {
              userId: user._id,
              name: user.name,
              email: user.email
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1d"
            }
          );
          return res.status(200).json({ message: "Login successful", token });
        }

        return res.status(401).json({ message: "Email or Password is in correct" });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.verify = (req, res) => {
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
};

exports.reverify = (req, res) => {
  const { userId } = req.body;
  User.findById(userId)
    .then(user => {
      const mailOptions = {
        from: process.env.MAIL_EMAIL,
        to: user.email,
        subject: "Welcome user",
        template: "verify-user",
        context: {
          name: user.name,
          verifyUrl: `${req.protocol}://${req.headers.host}/users/verify?token=${verifyToken}&email=${user.email}&verify=true`
        }
      };
      userToken(userId, mailOptions);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
