const jwt = require("jsonwebtoken")
const User = require("../models/user")
//  const adminauth = (req,res,next)=>{
//     const token = "xyz";
//     const isAuthenticate = token === "xyz";
//     if(!isAuthenticate){
//         console.log("no ")
//         res.status(401).send("Your are not a valid user!!");
//     }else{
//         next();
//     }
// }
//  const userauth = (req,res,next)=>{
//     const token = "xyz";
//     const isAuthenticate = token === "xyz";
//     if(!isAuthenticate){
//         console.log("no ")
//         res.status(401).send("Your are not a valid user!!");
//     }else{
//         next();
//     }
// }

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
        res.status(400).send("Error : "+err.message);
    }
   
}
module.exports={userauth}