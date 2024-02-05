const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config()
const cookieParser = require("cookie-parser")
const { BlacklistToken } = require("../Models/BlacklistModel")
const productRouter = require("../Routes/productRoute")

const access_secretKey = process.env.ACCESS_SECRET_KEY
const refresh_secretKey = process.env.REFRESH_SECRET_KEY

const auth = async (req, res, next) => {
  
  console.log("line12",req.cookies)
  const {ACCESS_TOKEN} = req.cookies
  console.log("line14",ACCESS_TOKEN)
  const refresh_token = req.cookies.REFRESH_TOKEN

  try {
    const blacklistExists = await BlacklistToken.findOne({ token:ACCESS_TOKEN })
    console.log(blacklistExists)
    if (blacklistExists) {
      throw new Error("Please login again !")
    }
    jwt.verify(ACCESS_TOKEN, access_secretKey, (err, decode) => {
      if (decode) {
        req.body.userID = decode.userID
        req.body.user = decode.user
        next()

      } else {
        jwt.verify(refresh_token, refresh_secretKey, (err, decode) => {
          const cookieOptions = { httpOnly: true, secure: true, sameSite: "none" }
          if (decode) {
            const token = jwt.sign({ userID: decode._id, user: decode.username }, access_secretKey, { expiresIn: "1h" })
            res.cookie("ACCESS_TOKEN", token, cookieOptions)
            next()
          } else {
            res.status(400).send({ "msg": "Now you need to login again" })
          }
        })
        res.status(400).send({ "error": err })
      }
    });
  }
  catch (error) {
    res.status(400).send({ "error": error})
    console.log(error)
  }



}

module.exports = {
  auth
}







// const User = require("../Models/userModel");
// const jwt = require("jsonwebtoken");

// const isAuthenticated = async (req, res, next) => {
//   const token = req.headers.token;
//   if (!token) {
//     return res.status(401).send({ message: "Please login !!" });
//   }
//   try {
//     const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decodedData._id);
//     next();
//   } catch (error) {
//     return res.status(401).send({ error: error.message });
//   }
// };

// const isAuthorize = async (req, res, next) => {
//   const role = req.body.user.role;
//   if (role != "admin") {
//     return res
//       .status(401)
//       .send({ message: "You are not authorized to do this function" });
//   }
//   next();
// };

// module.exports = { isAuthenticated, isAuthorize };




