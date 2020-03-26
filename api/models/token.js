const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    token: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"]
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    versionKey: false,
    strict: true
  }
);

module.exports = mongoose.model("Token", tokenSchema);
