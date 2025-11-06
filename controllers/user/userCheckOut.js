const User = require("../../models/userSchema");
const mongoose = require("mongoose");
const Cart = require("../../models/cartSchema");
const Address = require("../../models/addressSchema");
const Order = require("../../models/orderSchema");
const Product = require("../../models/productSchema");
const { STATUS, MESSAGES } = require("../../utils/constants");
const AppError=require('../../utils/appError')

const loadCheckOut = async (req, res,next) => {
  try {
    const userId = req.session.user._id;

    const user = await User.findOne({ _id: userId });
    const cart = await Cart.findOne({ userId: userId }).populate(
      "items.productId"
    );
    let address = await Address.findOne({ user: userId });
    if(!address){
      res.redirect('/addAddress')
    }

  
    res.render("user/checkout", { user, cart, address });
  } catch (error) {
   next(new AppError(MESSAGES.SERVER_ERROR,STATUS.SERVER_ERROR,))
  }
};
const placeOrder = async (req,res) => {

 const { address, paymentMethod } = req.body;
  const userId = req.session.user._id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {

    const cart = await Cart.findOne({ userId }).populate('items.productId').session(session);
    if (!cart || cart.items.length === 0) {
      throw new Error(`Cart is empty`);
    }
    const userAddress = await Address.findOne({user:userId})

    const selectedAddress = userAddress.address.find((add) =>
        add._id.equals(address._id)
    );

    if(!selectedAddress){
      throw new Error('select a vaild address')
    }

    const orderedItems = cart.items.map(item=>({
      productId:item.productId._id,
      name:item.productId.productName,
      price:item.price,
      quantity:item.quantity
    }))

     for (const item of orderedItems) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) throw new Error(`Product not found: ${item.productId}`);
      if (product.quantity < item.quantity)
        throw new Error(`Insufficient stock for ${product.name}`);
      if(product.isDeleted)throw new Error(`Product is unavilable  for ${item.name}`,)

      product.quantity -= item.quantity;
      product.status = product.quantity > 0 ? "available" : "sold_out";

      await product.save({ session });
    }  

    const order = new Order({
      orderedItems,
      userId,
      paymentMethod,
      totalAmount:cart.totalPrice,
      finalAmount:cart.totalPrice,
      address:selectedAddress,
      invoiceDate:new Date().toLocaleDateString('en-GB'),
      couponApplied:false,
      status:"pending"
    })
     await Cart.findOneAndDelete({ userId }, { session });


    await order.save({ session });



    await session.commitTransaction();
    res.json({ success: true, orderId: order._id });
    
  } catch (error) {

    await session.abortTransaction();
    res.status(400).json({ success: false, message: error.message });
    
  }finally {
    session.endSession();
  }
  
}

module.exports = {
  loadCheckOut,
  placeOrder
};
