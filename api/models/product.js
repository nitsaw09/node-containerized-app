const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      trim: true
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);
