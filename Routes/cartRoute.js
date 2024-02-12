const CartModel = require("../Models/cartModel");
const express = require("express");
const { auth } = require("../Middlewares/authMiddleware");
const cartRouter = express.Router();
const ProductModel = require("../Models/productModel")


cartRouter.get("/", async (req, res) => {
  // const userId = req.body.userId;
  try {
    const carts = await CartModel.find()
    const myCart = await Promise.all(
      carts.map(async(ele)=>{
        const product = await ProductModel.findOne({_id:ele.productId})
        return product
      })
    )
    return res.status(200).send({ success: true, myCart });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
});


cartRouter.post("/add/:id", async (req, res) => {
   const productId = req.params.id
   console.log(productId)
   
  try {
   
    // const { userId } = req.body;
   
    // const product = await ProductModel.findOne({_id:productId})
    // if(product){
      const cart = new CartModel({ productId });
      await cart.save()
      return res.status(201).send({ message: `Product Added Successfully` });
    // } 
    
  } catch (error) {
    return res.status(404).send({ message: "Something went wrong 123abc" });
  }
});

cartRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const productToDelete = await CartModel.findOne({ productId: id });
    if (productToDelete) {
      const idToDelete = productToDelete._id;
      await CartModel.findByIdAndDelete(idToDelete);
      const deletedProduct = await ProductModel.findOne({ _id: id });
      res.status(200).json({
        message: "Item is removed from cart!",
        deletedProduct: deletedProduct,
      });
    } else
      throw new Error("Product not found! please pass a valid product id!");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = cartRouter;