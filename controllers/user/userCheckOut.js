const User = require("../../models/userSchema")
const Products =require("../../models/productSchema") 
const Cart = require("../../models/cartSchema")


const loadCheckOut = async (req, res) => {
    try {
        const userId = req.session.user._id
        
        const user =  await User.find({_id:userId}) 
        const cart = await Cart.findOne({userId:userId}).populate('items.productId')
        

        res.render('user/checkout', {user,cart})
    } catch (error) {
        res.status(500).json({success:false, message:"Server Error"})
    }
}

 


module.exports ={
    loadCheckOut
}