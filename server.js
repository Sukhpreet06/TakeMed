const express = require("express");
// import express from 'express';
const app= express();
require('dotenv').config();

const dbConfig=require("./config/dbConfig.js");
app.use(express.json());
const userRoute=require("./routes/userRoute.js")
const adminRoute=require("./routes/adminRoute.js")
const doctorRoute=require("./routes/doctorRoute.js")
const port = process.env.PORT || 5000;
app.use("/api/users",userRoute);
app.use("/api/admin",adminRoute);
app.use('/api/doctor',doctorRoute);
app.listen(port,()=>
    console.log(`Node server started at port number  ${port}`));

// app.get("/",(req,res)=>{
//     res.send("hey handsome :")
// })
console.log(process.env.MONGO_URL);