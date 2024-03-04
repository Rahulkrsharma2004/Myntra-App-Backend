const jwt = require("jsonwebtoken");
const { BlacklistToken } = require("../Models/BlacklistModel");

const access_secretKey = process.env.ACCESS_SECRET_KEY;
const refresh_secretKey = process.env.REFRESH_SECRET_KEY;

const auth = async (req, res, next) => {

  const accessToken = req.cookies.ACCESS_TOKEN;
  const refreshToken = req.cookies.REFRESH_TOKEN;
  console.log("Auth hit-accessToken",accessToken)
  console.log("refreshToken",refreshToken)

  try {

    const blacklistExists = await BlacklistToken.findOne({ ACCESS_TOKEN: accessToken });

    if (accessToken==undefined) {
      return res.status(401).send({ message: "Please login again!" });
    }

    jwt.verify(accessToken, access_secretKey, (err, decode) => {
      if (err) {
        jwt.verify(refreshToken, refresh_secretKey, (err, decode) => {
          const cookieOptions={httpOnly:true,secure:true,sameSite:"none"}
          if (err) {
            return res.status(401).send({ message: "You need to login again" });
          }
          const newAccessToken = jwt.sign(
            { userID: decode.userID, user: decode.username },
            access_secretKey,
            { expiresIn: "1h" }
          );
          const newRefreshToken = jwt.sign(
            { userID: decode.userID, user: decode.username },
            refresh_secretKey,
            { expiresIn: "7d" }
          );
          res.cookie("ACCESS_TOKEN", newAccessToken);
          res.cookie("REFRESH_TOKEN", newRefreshToken);
          next();
        });
      } else {
        req.body.userID = decode.userID;
        req.body.user = decode.user;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { auth };
