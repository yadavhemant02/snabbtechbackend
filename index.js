const express = require("express")
const mongoose = require('mongoose')
const user = require("./controller/userController.js")
const app = express();
const cors = require('cors')
app.use(cors())
mongoose.connect("mongodb://127.0.0.1:27017/userdatabase")
.then((data)=>{
    console.log("connected")
}).catch((err)=>{
   console.log(err)
});


app.use("/api",user);

app.listen(5523,function(){
    console.log("server is ready")
})  