const ProductModel = require("../Models/productModel");
const express = require("express");
const productRouter = express.Router();
const { auth } = require("../Middlewares/authMiddleware");


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


productRouter.get("/", async (req, res) => {
  try {
    let {
      keyword,
      category,
      subcategory,
      price,
      brand,
      color,
      sort,
      limit,
      page,
    } = req.query;

    const query = {};

    if (keyword) {
      query.title = {
        $regex: keyword,
        $options: "i",
      };
    }

    if (category) {
      // Check for different category filters
      if (category === "Men" || category === "Women" || category === "Kids" || category === "Beauty") {
        query.category = category;
      } else {
        // Handle invalid category value
        return res.status(400).send({ message: "Invalid category value" });
      }
    }

    if (subcategory) {
      // Check for different category filters
      if (subcategory === "T-Shirts" || subcategory === "Jeans" || subcategory === "Flip Flops" ||
        subcategory === "Kurtas & Suits" || subcategory === "Sarees" || subcategory === "Heels" ||
        subcategory === "T-Shirts" || subcategory === "Party Wear" || subcategory === "Trousers" || subcategory === "Face Wash" || subcategory === "Lip Stick" || subcategory === "Beauty Gift") {
        query.subcategory = subcategory;
      } else {
        // Handle invalid category value
        return res.status(400).send({ message: "Invalid subcategory value" });
      }
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
      limit = 120;
    }

    if (!page) {
      page = 1;
    }

    const products = await ProductModel.find(query)
      .limit(+limit)
      .skip((+page - 1) * limit);

    if (category) {
      totalProduct = await ProductModel.find({ category });
    }
    if (subcategory) {
      totalProduct = await ProductModel.find({ subcategory });
    }
    if (!products) {
      return res.status(404).send({ message: "Product not found" });
    }

    return res
      .status(200)
      .send({ success: true, products });
  } catch (error) {
    return res.status(500).send({ error: error.message });
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

productRouter.put("/update", auth, async (req, res, next) => {
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


productRouter.delete("/delete", auth, async (req, res, next) => {
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