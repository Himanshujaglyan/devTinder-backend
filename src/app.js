const express = require('express');
const connectDB = require("./Config/database");
const app = express();
const cors = require("cors")
// const User = require("./models/user")
// const {userauth} = require("./Middleware/auth")
// const {validatesignupdata} = require("./utils/validatesignupdata")
// const bcrypt = require("bcrypt")
// const validator = require("validator")
const cookieParser = require("cookie-parser")
// const jwt = require("jsonwebtoken");
// app.get("/user", (req,res)=>{
//     console.log(req.query)
//     res.send({"Name":"Himanshu","age":"21"})
// })
// app.post("/user",(req,res)=>{
    
//     res.send("Data successfully saved to the DB")
// })
// app.delete("/user",(req,res)=>{
//     res.send("Deleted succesfully");
// })
// app.use("/test", (req, res) => {
//     res.send("This is the / Route");
// });
// -------------------------------------------------------------------
//Multiple Route Handlers
// app.use("/test",(req,res,next)=>{
//     //request Handler
//     console.log("Response 1")
//     // res.send("This is the resposnse 1")
//     next();
// },
// (req,res)=>{
//     console.log("Response 2")
//     res.send("This is the response 2")
// })

//Thats why we use middleware because it helps us to write less or don't repeat the code
//So here below is the middle ware which handle authetication for both getalldata and deleteuser
// app.use("/admin",adminauth)

// app.use("/user",userauth,(req,res)=>{
//     res.send("Welcome to user");
// })

// app.use("/admin/getalldata", (req,res)=>{
//     res.send("Welcome data is here!")
// })
// app.use("/admin/deleteuser", (req,res)=>{
//     res.send("Successfully deleted the user!!")
// })

//------------------------Handling Error------------------------
// app.use("/",(err,req,res)=>{
//     if(err){
//         res.status(500).send("Something went wrong!")
//     }
// })
// --------------------------------------------------------------
    app.use(express.json());//this is middleware which helps to convert json into js object because server can't undertand json directly
    app.use(cookieParser());
    app.use(cors({
        origin:"http://localhost:5173",
        credentials:true
    }));
    app.get("/", (req, res) => {
        res.send("Backend is running!");
      });
    const authRouter = require("./routes/authRouter.js")
    const profileRouter = require("./routes/profileRouter.js");
    const requestRouter = require("./routes/requestRouter.js")
    const userRouter = require("./routes/userRouter.js")

    app.use("/",authRouter);
    app.use("/",profileRouter);
    app.use("/",requestRouter);
    app.use("/",userRouter);
    //Delete request
    // app.delete("/user",async(req,res)=>{ 
    //     const userId = req.body.userId;
    //     try{
    //         await User.findByIdAndDelete({_id : userId});
    //         res.send("User Deleted Successfully!")
    //     }
    //     catch(err){
    //         res.status(401).send("Something went Wrong!!")
    //     }
    // })
    // Update the data by using perticular id
    // app.patch("/user/:userID", async (req, res) => {
    //     const userId = req.params?.userID;
    //     const data = req.body;
    
    //     try {

    //         const Allowed_fields = ["firstName", "about", "age"];
    //         const isupdateallowed = Object.keys(data).every((k) =>
    //             Allowed_fields.includes(k)
    //         );
    
    //         if (!isupdateallowed) {
    //             return res.status(400).send("Update not allowed!");
    //         }
    
    //         const user = await User.findById(userId);
    //         if (!user) {
    //             return res.status(404).send("User not found!");
    //         }

    //         const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });
    
    //         res.send("Update successfully!!");
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).send("Something went wrong!!");
    //     }
    // });
    


connectDB()
    .then(()=>{
        console.log("Database connected");
        app.listen(3000,()=>{
            console.log("Server is successfuly listening on port 3000......")
        });
    })
    .catch((err)=>{ 
        console.log("Database connot connected");
    });


// mongodb+srv://HimanshuJaglyan:Himanshu123@namastenode.4ette.mongodb.net/