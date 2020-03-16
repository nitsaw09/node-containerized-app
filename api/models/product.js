const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      index: { unique: true }
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
    },
    productImage: {
      type: String,
      require: [true, "Product image is required"],
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

module.exports = mongoose.model("Product", productSchema);
