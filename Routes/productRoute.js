const ProductModel = require("../Models/productModel");
const express = require("express");
const productRouter = express.Router();
const {auth}  = require("../Middlewares/authMiddleware");

//Create Product
productRouter.post("/add",auth, async (req, res, next) => {
  try {
    const product = new ProductModel(req.body);
    await product.save()
    console.log(product)
    return res
      .status(201)
      .send({ message: "Product added successfully", product });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

//get all products
productRouter.get("/", async (req, res) => {
  try {
    let {
      keyword,
      category,
      price,
      brand,
      color,
      discount,
      sort,
      orderBy,
      limit,
      page,
      gender,
      categories,
    } = req.query;

    const query = {};
    if (keyword) {
      query.title = {
        $regex: keyword,
        $options: "i",
      };
    }

    if (category) {
      query.category = category;
    }
    if (gender) {
      query.gender = gender;
    }
    if (categories) {
      query.categories = categories;
    }

    if (brand) {
      query.brand = brand;
    }

    if (price) {
      let [min, max] = price.split(",");
      query.price = { $gte: min, $lte: max };
    }

    if (color) {
      query.color = color;
    }

    if (discount) {
      let [min, max] = discount.split(",");
      query.discount = { $gte: min, $lte: max };
    }

    if (!limit) {
      limit = 20;
    }

    if (!page) {
      page = 1;
    }

    const products = await Product.find(query)
      .sort({ [sort]: orderBy === "asc" ? 1 : orderBy === "desc" ? -1 : 0 })
      .limit(+limit)
      .skip((+page - 1) * limit);
      
    let totalProduct;
    if (gender) {
      totalProduct = await ProductModel.find({ gender });
    } else {
      totalProduct = await ProductModel.find();
    }
    if (!products) {
      return res.status(404).send({ message: "Product not found" });
    }
    const productLength = products.length;
    const totalPage = totalProduct.length / productLength;
    return res
      .status(200)
      .send({ success: true, products, productLength, totalPage });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

//get single product
productRouter.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    return res.status(200).send({ success: true, product });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

//update product
productRouter.put("/update",auth, async (req, res, next) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
    });
    return res
      .status(200)
      .send({ message: "Product updated successfully", product });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

//delete product
productRouter.delete("/delete",auth, async (req, res, next) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.query.id);
    return res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

// create & update review
productRouter.put("/review", async (req, res, next) => {
  const { ratings, comment, productId, userId, name } = req.body;
  const review = {
    user: userId,
    name,
    ratings: Number(ratings),
    comment,
  };

  try {
    const product = await ProductModel.findById(productId);

    const isReview = product.reviews.find(
      (rev) => rev.user.toString() === userId.toString()
    );

    if (isReview) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === userId.toString()) {
          rev.ratings = ratings;
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.count = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.ratings;
    });
    product.rating = +avg / product.reviews.length;
    await product.save({ validateBeforeSave: false });

    return res.status(200).send({
      success: true,
      message: "Review Added successfully",
    });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

//delete review
productRouter.delete("/review/delete", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.query.productId);

    const review = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.revId.toString()
    );
    let avg = 0;
    review.forEach((rev) => {
      avg += rev.ratings;
    });
    const rating = avg / review.length;
    const count = review.length;
    product.count = count;
    product.rating = rating;
    product.reviews = review;
    await product.save({ validateBeforeSave: false });

    return res.status(200).send({
      success: true,
      message: "Review deleted successfully",
      product,
    });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

module.exports = productRouter;