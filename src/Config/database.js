const mongoose = require("mongoose");
const { SECRET_KEY } = require("../utils/constants");

const connectDB = async()=>{
    await mongoose.connect(SECRET_KEY)
}

module.exports = connectDB;