const CartModel = require("../Models/cartModel");
const express = require("express");
const { auth } = require("../Middlewares/authMiddleware");
const cartRouter = express.Router();


cartRouter.get("/", async (req, res) => {
  const userId = req.body.userId;
  try {
    const carts = await CartModel.find({ userId }).populate("productId");
    return res.status(200).send({ success: true, carts });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
});


cartRouter.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const isProductExist = await CartModel.findOne({ productId, userId });
    if (isProductExist) {
      return res
        .status(404)
        .send({ message: "Product already exists in cart" });
    }
    const cart = await CartModel.create({ userId, productId, quantity });
    const newCartItem = await CartModel.findById(cart._id)
      .populate("productId")
      .select("-userId");
    return res.status(201).send({ message: `Product Added Successfully` });
  } catch (error) {
    return res.status(404).send({ message: "Something went wrong" });
  }
});



cartRouter.delete("/delete", async (req, res) => {
  try {
    const { id, userId } = req.body;
    const cartItem = await CartModel.findById(id);
    if (cartItem && cartItem.userId.toString() === userId) {
      const cart = await CartModel.findByIdAndDelete(id)
        .populate("productId")
        .select("-userId");
      return res
        .status(200)
        .send({ message: `Deleted the product from cart successfully` });
    } else {
      return res.status(404).send({ message: "Item does not exist in cart" });
    }
  } catch (error) {
    return res.status(404).send({ message: "Something went wrong" });
  }
});

module.exports = cartRouter;