const express = require("express");
const profileRouter = express.Router();
const {userauth} = require("../Middleware/auth");
const validator = require("validator")
const bcrypt = require("bcrypt")
// const authRouter = require("./authrouter");
const {validateProfileUpdateDate} = require("../utils/validatesignupdata");
//Profile view
profileRouter.get("/profile",userauth,(req,res)=>{
    try{
        const user = req.user;
        res.send(user)
    }   
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
}) 

//Profile Update
profileRouter.patch("/profile/edit",userauth,async(req,res) =>{
    try{
        if(!validateProfileUpdateDate){
        throw new Error("Don't update Email Id and Password");
    }
    const loggedUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]) )
    await loggedUser.save();
    res.send(loggedUser)
    }
    catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
})

profileRouter.patch("/profile/password",userauth,async(req,res)=>{
        try{
        const updatedpassword = req.body.password;
        if(!validator.isStrongPassword(updatedpassword)){
            throw new Error("ERROR : "+err.message);
        }
        const hashPassword = await bcrypt.hash(updatedpassword,10)
        req.user.password = hashPassword;
        await req.user.save();
        res.send("Password change successfully");
        }
        catch(err){
            res.status(400).send("ERROR : " + err.message);
        }
})
module.exports = profileRouter;