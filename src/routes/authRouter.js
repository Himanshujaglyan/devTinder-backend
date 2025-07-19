const express = require("express");
const authrouter = express.Router();
const {validatesignupdata} = require("../utils/validatesignupdata")
const bcrypt = require("bcrypt");
const User= require("../models/user")
const validator = require("validator")
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");

authrouter.post("/signup", async (req, res) => {
    try {
        validatesignupdata(req); // Custom validation logic (must throw Error on fail)

        const {firstName, lastName, emailId, password, age, gender, fatherName, profileImage} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: true
        });

        res.status(201).json({ 
            message: "User successfully registered!",
            data: savedUser 
        });

    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message || "An unknown error occurred during signup."
        });
    }
});


//Get Request
authrouter.get("/signup", async(req,res)=>{
        const userEmail = req.body.emailId;

    try{
        const users = await User.find({emailId : userEmail})
        if(users.length === 0){
            res.send("User Not found!!");
        }else{
            res.send(users);
        }   
    }
    catch(err){
        res.status(401).send("Something went wrong!!")
    }
})
    
//Login
authrouter.post("/login" ,async(req,res) => {
    try{
        const {emailId, password} = req.body;
        if(!validator.isEmail(emailId)){
            throw new Error("Email not valid!");
        }else if(!validator.isStrongPassword(password)){
            throw new Error("Not a strong password!");
        }
        
        const user = await User.findOne({emailId:emailId})  


        if(!user){
            throw new Error("User Not Found");
        }
        
        const isPasswordMatch = await bcrypt.compare(password , user.password);
        if(isPasswordMatch){
            const token = await jwt.sign({_id:user._id}, "Dev@Tinder#786");
            res.cookie("token", token, {
                httpOnly: true,
                secure: true, // HTTPS ke liye (prod mein zaroori)
                sameSite: "None", // Jab frontend aur backend alag domain pe ho
              });
            res.send(user); 
        }else{
            throw new Error("Password not correct!!");
        }
    }
    catch(err){
        res.status(400).send(err.message);
    }
});


//Logout
// authrouter.post("/logout", catchAsync(async (req,res)=>{
//     res.cookie("token", null ,{
//         expires : new Date(Date.now()),
//     }).send("logout successfully!!")
// }))
authrouter.post("/logout", async(req, res) => {
    res.cookie("token", null, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now()),
    });
    res.send("Logout successfully!");
  });
  
module.exports = authrouter;
