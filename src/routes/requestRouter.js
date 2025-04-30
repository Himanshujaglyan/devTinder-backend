const express = require("express");
const requestRouter = express.Router();
const {userauth} = require("../Middleware/auth")
const ConnectionRequest = require('../models/ConnectionRequest')
const User = require("../models/user")
//Connection Request
requestRouter.post("/request/send/:status/:userId" ,userauth, async(req,res)=>{
   try{
        const fromuserId = req.user._id ;
        const touserId = req.params.userId;
        const status = req.params.status;

        const allwedStatus = ["ignored","interested"];
        if(!allwedStatus.includes(status)){
            return res.status(400).send("status not valid");
        }
        //if random user ko connection bhejni ho
        const toUser = await User.findById(touserId);
        if(!toUser){
            return res.status(404).json({message:"User not found"});
        }
        // to check that you already send a connection request and any body cant send i think yahi hai 
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromuserId,touserId},
                {fromuserId : touserId , touserId : fromuserId},
            ],
        });
        if(existingConnectionRequest){
            return res
                .status(400)
                .send({message:"Connection Request Already Exists!!"});
        }


        const newRequest = new ConnectionRequest({
            status,
            fromuserId,
            touserId,
        })
        
        const data = await newRequest.save();
        res.json({
            message:"Connection request send successfully",
            data,
        })

   }
   catch(err){
    res.status(400).send("ERROR : " + err.message);
   }
})

requestRouter.post("/request/review/:status/:requestId" , userauth , async(req,res)=>{
    try{
        const loggedUser = req.user;// jis user ko connection request aai hai yai ab accept kerage ya reject
        const {status , requestId} = req.params;

        const allowedStatus = ["accepted" , "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).send("There is invalid Status");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            touserId : loggedUser._id,
            status:"interested"
        })
        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request Not found!!" });
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();
        
        res.json({message : "Connection Request "+ status, data})
    
    }
    catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
})
module.exports = requestRouter;