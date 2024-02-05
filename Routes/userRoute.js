const express = require("express")
const dotenv = require('dotenv').config()
const { UserModel } = require("../Models/userModel")
const userRouter = express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const {auth} = require("../Middlewares/authMiddleware")
const {BlacklistToken}  = require("../Models/BlacklistModel")


const access_secretKey = process.env.ACCESS_SECRET_KEY
const refresh_secretKey = process.env.REFRESH_SECRET_KEY

// authRouter.use(cookieParser());

userRouter.post("/register", async (req, res) => {

    const { username, email, pass} = req.body
    console.log(req.body)
    try {

         if (!isValidPassword(pass)) {
            return res.status(200).json({ error: 'Invalid password format' });
        }
 

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(200).json({ error: 'User with this email already exists' });
        }

        bcrypt.hash(pass, 5, async function (err, hash) {
            if (err) {
                res.send({ "msg": err })
            }
            else {
                const user = new UserModel({ username, email, pass: hash})
                await user.save()
                res.status(200).send({ "msg": "New user has been created" })
            }
        })

    } catch (error) {
        res.status(400).send({ "msg": error })
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body
    const cookieOptions={httpOnly:true,secure:true,sameSite:"none"}
    try {
        const user = await UserModel.findOne({ email })
        console.log(user)
        if (user) {
            bcrypt.compare(pass, user.pass, function (err, result) {
                if (result) {
                    const token = jwt.sign({userID:user._id,user:user.username}, access_secretKey ,{expiresIn:"1h"});
                    const refresh_token = jwt.sign({userID:user._id,user:user.username}, refresh_secretKey ,{expiresIn:"7d"});
                    res.cookie("ACCESS_TOKEN",token,cookieOptions)
                    res.cookie("REFRESH_TOKEN",refresh_token,cookieOptions)
                    res.status(200).send({ "msg": "Login Successful","token":token})
                    
                } else {
                    res.status(200).send({ "msg": "Register first or Wrong crendential" })
                }

            });

        }else{
            res.status(404).send("User not found")
        }

    } catch (error) {
        res.status(400).json({message:error})
    }
})                         

const isValidPassword = (pass) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(pass);
};

userRouter.post("/logout", async (req, res) => {
  try {   
      const token = req.cookies.ACCESS_TOKEN
      console.log(token)
      const blacklistToken = new BlacklistToken({token})
      await blacklistToken.save()
      res.status(200).send("Logout Successfully")
  } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
  }
})



module.exports = userRouter;