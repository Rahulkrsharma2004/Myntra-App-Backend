const express = require("express");
const { auth } = require("../Middlewares/authMiddleware");
const wishlistRouter = express.Router();
const ProductModel = require("../Models/productModel");
const WishListModel = require("../Models/wishlistModel");


wishlistRouter.get("/", async (req, res) => {
  try {
    const wishlist = await WishListModel.find()
    const myWishlist = await Promise.all(
      wishlist.map(async(ele)=>{
        const product = await ProductModel.findOne({_id:ele.productId})
        return product
      })
    )
    console.log(myWishlist)
    return res.status(200).send({ success: true, myWishlist });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
});


wishlistRouter.post("/add/:id", async (req, res) => {
   const productId = req.params.id
   console.log(productId)
   
  try {
      const cart = new WishListModel({ productId });
      await cart.save()
      return res.status(201).send({ message: `Product Added Successfully in Wishlist` });
    // } 
    
  } catch (error) {
    return res.status(404).send({ message: "Something went wrong !" });
  }
});

wishlistRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const productToDelete = await WishListModel.findOne({ productId: id });
    if (productToDelete) {
      const idToDelete = productToDelete._id;
      await WishListModel.findByIdAndDelete(idToDelete);
      const deletedProduct = await ProductModel.findOne({ _id: id });
      res.status(200).json({
        message: "Item was removed from Wishlist!",
        deletedProduct: deletedProduct,
      });
    } else
      throw new Error("Product not found! please pass a valid product id!");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = wishlistRouter;