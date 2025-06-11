const mongoose = require("mongoose");
const env = require('dotenv').config();

let connectDB =async ()=>{

try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("Connected to DB");
} catch (error) {

    console.log("Failed to connect DB",error.message);
    process.exit(1);
}

}

module.exports = connectDB;