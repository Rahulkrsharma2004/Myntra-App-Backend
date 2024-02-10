const ProductModel = require("../Models/productModel");
const express = require("express");
const productRouter = express.Router();
const {auth}  = require("../Middlewares/authMiddleware");


productRouter.post("/add", async (req, res, next) => {
  // return res.send('Checking cookies')
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


productRouter.get("/",async (req, res) => {
  try {
    let {
      keyword,
      category,
      price,
      brand,
      color,
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

    if (!limit) {
      limit = 20;
    }

    if (!page) {
      page = 1;
    }

    const products = await ProductModel.find(query)
      // .sort({ [sort]: orderBy === "asc" ? 1 : orderBy === "desc" ? -1 : 0 })
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


productRouter.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    return res.status(200).send({ success: true, product });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});


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

module.exports = productRouter;