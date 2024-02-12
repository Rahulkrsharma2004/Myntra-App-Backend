const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config()
const cookieParser = require("cookie-parser")
const { BlacklistToken } = require("../Models/BlacklistModel")
const productRouter = require("../Routes/productRoute")

const access_secretKey = process.env.ACCESS_SECRET_KEY
const refresh_secretKey = process.env.REFRESH_SECRET_KEY

const auth = async (req, res, next) => {
  
  console.log("access okten", req.cookies.access_token);
  console.log("ACCCESS_TOKEN", req.cookies.ACCESS_TOKEN)

  try {
    const blacklistExists = await BlacklistToken.findOne({ token: ACCESS_TOKEN })
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
          const cookieOptions = { httpOnly: true, secure: true, sameSite: "none" ,domain: "localhost"}
          if (decode) {
            const token = jwt.sign({ userID: decode._id, user: decode.username }, access_secretKey, { expiresIn: "1h" })
            res.cookie("ACCESS_TOKEN", token, cookieOptions)
            next()
          } else {
           return res.status(400).send({ "msg": "Now you need to login again" })
          }
        })
      }
    });
  }
  catch (error) {
    console.log(error)
    return res.status(400).send({ "error": error })
    
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




