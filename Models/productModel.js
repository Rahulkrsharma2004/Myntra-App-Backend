const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new mongoose.Schema(
  {
    images: {
      type: Object,
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
      type: Array,
      required: true,
    },
    sizes: {
      type: Array,
      required: true,
    },
    shapes: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      maxLength: 6,
    },
    off_price: {
      type: Number,
      required: true,
      maxLength: 6,
    },
    discount: {
      type: Number,
      required: true,
    },
    subcategory: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    versionKey: false,
  }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;