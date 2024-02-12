const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type:String,
            required:true,
        },
        productId: {
            type:String,
            required:true,
        },
        
    },
    {
        versionKey: false,
    }
);

const CartModel = mongoose.model("Cart", cartSchema);

module.exports = CartModel;