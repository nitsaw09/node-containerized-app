const mongoose = require("mongoose");
const { validateEmail } = require("../functions/validate");

const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: [validateEmail, "Please enter valid email"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: null
    }
  },
  {
    versionKey: false,
    strict: true
  }
);

module.exports = mongoose.model("User", userSchema);
