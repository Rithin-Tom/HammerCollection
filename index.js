const express  = require("express");
const app = express();
const env = require('dotenv').config()
const DB = require('./config/db');
DB()




app.listen(process.env.PORT,()=>{
    console.log("server is running")
}) 