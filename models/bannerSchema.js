const mongoose = require("mongoose")
const { stringify } = require("uuid")

const {Schema} = mongoose


const bannerSchema = new Schema({
    image:{
        type:String,
        required:true
    },
    titile:{
        type:String,
        required:true
    },
    discription:{
        type:String,
        required:true
    },
    link:{
        type:String
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    }
})

const Banner = mongoose.model("Banner",bannerSchema)

module.exports = Banner;