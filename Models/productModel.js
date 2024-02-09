const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sizes: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      maxLength: 6,
    },
    subcategory: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;