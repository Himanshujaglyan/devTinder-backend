const express = require('express');
const connectDB = require("./Config/database");
const app = express();
const cors = require("cors")
const http = require("http")

const cookieParser = require("cookie-parser")

// --------------------------------------------------------------
    app.use(express.json());//this is middleware which helps to convert json into js object because server can't undertand json directly
    app.use(cookieParser());
    app.use(cors({
        origin:true, //http://localhost:5173
        credentials:true
    }));
    app.get("/", (req, res) => {
        res.send("Backend is running!");
      });
    



    const authRouter = require("./routes/authRouter.js")
    const profileRouter = require("./routes/profileRouter.js");
    const requestRouter = require("./routes/requestRouter.js")
    const userRouter = require("./routes/userRouter.js")
    const paymentRouter = require("./routes/payment.js");
    const initializeSocket = require('./utils/socket.js');
    const chatRouter = require('./routes/chat.js');

    app.use("/",authRouter);
    app.use("/",profileRouter);
    app.use("/",requestRouter);
    app.use("/",userRouter);
    app.use("/",paymentRouter)
    app.use("/",chatRouter)

    //websocket
    const server = http.createServer(app);
    initializeSocket(server);
    //Global Error Handler
    app.use((err,req,res,next)=>{
        console.log(err.stack)
        return res.status(500).json({msg:"Something went wrong"})
    })

connectDB()
    .then(()=>{
        console.log("Database connected");
        server.listen(3000,()=>{
            console.log("Server is successfuly listening on port 3000......")
        });
    })
    .catch((err)=>{ 
        console.log("Database connot connected");
    });


