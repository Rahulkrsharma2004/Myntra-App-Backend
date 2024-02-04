//imports
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require('./db')

const productRoutes = require("./Routes/productRoute");
const userRoutes = require("./Routes/userRoute");
const orderRoutes = require("./Routes/orderRoute");
const cartRoutes = require("./Routes/cartRoute");
const PORT = process.env.PORT

app.use(express.json());
app.use(cors());

app.use("/product", productRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/cart", cartRoutes);


app.listen(PORT, async () => {
    try {
        await connection
        console.log(`Express server running on port ${PORT} and db is also connected`)
    } catch (error) {
        console.log(error)
    }
})