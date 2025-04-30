const express = require("express");
const userRouter = express.Router();
const {userauth} = require("../Middleware/auth");
const ConnectionRequests = require("../models/ConnectionRequest");
const User = require("../models/user");
const { connection } = require("mongoose");

userRouter.get("/user/request" , userauth , async(req,res)=>{
    try{
        const loggedInuser = req.user;
        
        const connectionRequests = await ConnectionRequests.find({
            touserId : loggedInuser._id,
            status :"interested",
        }).populate("fromuserId",["firstName", "lastName","profileImage","age","gender","about"]);
        
        res.json({
            message:"Data fetched successfully",
            data: connectionRequests,
        })
    }   
    catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
})


userRouter.get("/user/connections" , userauth , async(req,res)=>{
    try{
        const loggedUser = req.user;
        const connectionRequests = await ConnectionRequests.find({
            $or:[
             { touserId : loggedUser._id,status:"accepted"},
            { fromuserId: loggedUser._id , status: "accepted"},   
            ],
        }).populate("fromuserId",["firstName", "lastName","profileImage","age","gender","about"] )
          .populate("touserId",["firstName", "lastName"])


        const data = connectionRequests.map((row)=> {
            if(row.fromuserId._id.toString() === loggedUser._id.toString()){
                return row.touserId;
            }
            return row.fromuserId;
        });
        res.json({data});
    }
    catch(err){
        console.log(err.message)
        res.status(400).send({message: err.message});
    }
})


//vo feed show honi chaiye sirf jiska aaj se pahle koi lena dena nahi hai okk
userRouter.get("/feed",userauth,async(req,res)=>{
    try{
        const loggedInuser = req.user;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1)*limit;
        // yaha vo select honge jinko mene connection request bheji hai or ya phir kisi ne merko connection request bheji hai 
        const connectionRequests = await ConnectionRequests.find({
            $or : [
                {"fromuserId" : loggedInuser._id},
                {"touserId" : loggedInuser._id} 
            ]
        }).select("fromuserId touserId");

        const hideuserFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideuserFromFeed.add(req.fromuserId.toString())
            hideuserFromFeed.add(req.touserId.toString())
        })

        const users = await User.find({
            $and : [
                {_id : {$nin : Array.from(hideuserFromFeed)},},
                {_id : {$ne : loggedInuser._id}}
            ]
        }).skip(skip).limit(limit)

        res.send(users);
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})
module.exports = userRouter;