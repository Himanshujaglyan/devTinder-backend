const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://HimanshuJaglyan:Himanshu123@namastenode.4ette.mongodb.net/devTinder")
}

module.exports = connectDB;