const jwt = require("jsonwebtoken");
require("dotenv").config();
const { BlacklistToken } = require("../Models/BlacklistModel");

const access_secretKey = process.env.ACCESS_SECRET_KEY;
const refresh_secretKey = process.env.REFRESH_SECRET_KEY;

const auth = async (req, res, next) => {
  const accessToken = req.cookies.ACCESS_TOKEN;
  const refreshToken = req.cookies.REFRESH_TOKEN;
  console.log(accessToken)
  console.log(refreshToken)
  console.log(refreshToken)
  try {

    if (!accessToken) {
      return res.status(401).send({ message: "Please login again!" });
    }

    jwt.verify(accessToken, access_secretKey, (err, decoded) => {
      if (err) {
        jwt.verify(refreshToken, refresh_secretKey, (err, decoded) => {
          if (err) {
            return res.status(401).send({ message: "You need to login again" });
          }
          const newAccessToken = jwt.sign(
            { userID: decoded.userID, user: decoded.username },
            access_secretKey,
            { expiresIn: "1h" }
          );
          const newRefreshToken = jwt.sign(
            { userID: decoded.userID, user: decoded.username },
            refresh_secretKey,
            { expiresIn: "7d" }
          );
          const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          };
          res.cookie("ACCESS_TOKEN", newAccessToken, cookieOptions);
          res.cookie("REFRESH_TOKEN", newRefreshToken, cookieOptions);
          req.body.userID = decoded.userID;
          req.body.user = decoded.user;
          next();
        });
      } else {
        req.body.userID = decoded.userID;
        req.body.user = decoded.user;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { auth };
