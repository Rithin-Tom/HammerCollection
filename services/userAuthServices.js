const User = require("../models/userSchema")


const findOneUserByEmail = async (email) =>{
    try{

        const user = await User.findOne({ email })

        if(!user){
           return false
        }

        return user;

    }catch(err){
        throw new Error(err.message)
    }
}

module.exports = { findOneUserByEmail }