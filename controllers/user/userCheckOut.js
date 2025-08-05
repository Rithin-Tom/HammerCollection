const User = require("../../models/userSchema")
const Products =require("../../models/productSchema") 
const Cart = require("../../models/cartSchema")
const Address = require("../../models/addressSchema")


const loadCheckOut = async (req, res) => {
    try {
        const userId = req.session.user._id
        console.log(req.session.user)
        const user =  await User.findOne({_id:userId}) 
        const cart = await Cart.findOne({userId:userId}).populate('items.productId')
        let address = await Address.findOne({user:userId})
        
        
        console.log("user:",user)

        res.render('user/checkout', {user,cart,address})
    } catch (error) {
        res.status(500).json({success:false, message:"Server Error"})
    }
}

 


module.exports ={
    loadCheckOut
}