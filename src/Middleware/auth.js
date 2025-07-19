const jwt = require("jsonwebtoken")
const User = require("../models/user")


const userauth = async (req,res,next)=>{
    try{ 
    const {token} = req.cookies;
    if(!token){
       return res.status(401).send("Please Login!")
    }
    const decodeMessage = await jwt.verify(token , "Dev@Tinder#786");
    const {_id} = decodeMessage;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found!");
    }
    req.user = user;
    next();
    }
    catch(err){
        res.status(400).send(err.message);
    }
   
}
module.exports={userauth}