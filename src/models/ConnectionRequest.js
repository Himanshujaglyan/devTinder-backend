const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema({
    fromuserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    touserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String, 
        enum: {
            values: ["rejected", "accepted", "ignored", "interested"],
            message: "{VALUE} is incorrect status"  
        },
        required: true
    }
},
{timestamps:true}
);

ConnectionRequestSchema.pre("save",function (next){
    const connectionRequest = this;
    //check if the fromuserId is same as touserId
    if(connectionRequest.fromuserId.equals(connectionRequest.touserId)){
            throw new Error("Cannot send connection request to yourself!")
    }    
    next();
});




const ConnectionRequestModel = mongoose.model("ConnectionRequest", ConnectionRequestSchema);

module.exports = ConnectionRequestModel;
