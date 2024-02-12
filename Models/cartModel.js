const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        
    },
    {
        versionKey: false,
    }
);

const CartModel = mongoose.model("Cart", cartSchema);

module.exports = CartModel;