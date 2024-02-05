//imports
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require('./db')
const cookieParser = require("cookie-parser")
// const {BlacklistToken}  = require("./Models/BlacklistModel")

const productRouter = require("./Routes/productRoute");
const userRouter = require("./Routes/userRoute");
const orderRouter = require("./Routes/orderRoute");
const cartRouter = require("./Routes/cartRoute");
const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173","https://myntra-app-backend-production.up.railway.app","https://myntra-frontend-app.netlify.app"],
    credentials: true,
}));

app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/order", orderRouter);
app.use("/cart", cartRouter);


app.listen(PORT, async () => {
    try {
        await connection
        console.log(`Express server running on port ${PORT} and db is also connected`)
    } catch (error) {
        console.log(error)
    }
})