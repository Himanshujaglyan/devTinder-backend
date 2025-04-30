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
        validatesignupdata(req); //  Agar yahan error aayi toh catch block me chali jayegi
        const {firstName,lastName,emailId,password,age,gender,fatherName,profileImage} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        // console.log(passwordHash);
        const user = new User({
            firstName,
            lastName, 
            emailId, 
            password : passwordHash
        });

        const savedUser = await user.save();
        const token = await savedUser.getJWT();
        res.cookie("token",token,{
            expires:new Date(Date.now() + 8 * 3600000),
        });
        res.json({message : "User successfully Added!", data:savedUser});
    } catch (err) {
        res.status(400).send("Validation Error: " + err.message); // 🛠️ Error ka proper response
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
            throw new Error("User not found in DB");
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
        res.status(400).send("Error : " + err.message);
    }
});


//Logout
authrouter.post("/logout", catchAsync(async (req,res)=>{
    res.cookie("token", null ,{
        expires : new Date(Date.now()),
    }).send("logout successfully!!")
}))

module.exports = authrouter;
