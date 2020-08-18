const mongoose = require("mongoose");
const validate = require("../utils/validate");

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
      validate: [validate.email, "Please enter valid email"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true
    },
    verified: {
      type: Boolean,
      default: false
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
