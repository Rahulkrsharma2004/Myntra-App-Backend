const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
    {
        productId: {
            type:String,
            required:true,
        },
        
    },
    {
        versionKey: false,
    }
);

const WishListModel = mongoose.model("Wishlist", wishListSchema);

module.exports = WishListModel;