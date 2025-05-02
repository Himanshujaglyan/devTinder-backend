const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userschema = new mongoose.Schema(
 
   {
    firstName:{
        type: String,
        // required : true,
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String,
        required:true,
        // validator(value){
        //     if(!validator.isEmail(value)){
        //         throw new Error("Invalid email address : " + value)
        //     }
        // }
    },
    password:{
        type: String
    },
    fatherName:{
        type: String ,
        // required:true
    },
    age:{
        type : Number
    },
    about:{
        type:String,
        default:"This is the default about!!"
    },
    gender:{
        type: String
    },
    isPremium:{
        type: Boolean,
        default:false
    },
    membershipType:{
        type : String,
    },
    profileImage:{
        type:String,
    }
    
},{
    timestamps:true
})
userschema.methods.getJWT = function () {
    return jwt.sign({ _id: this._id }, "Dev@Tinder#786", {
        expiresIn: "8h",
    });
};

const User = mongoose.model("User",userschema);

module.exports = User;