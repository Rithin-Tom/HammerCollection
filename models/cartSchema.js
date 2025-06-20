const mongoose = require('mongoose');
const {Schema} = mongoose

const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product', // Assuming you have a Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  status:{
    type:String,
    default:"placed"
  },
  cancellationReason:{
    type:String,
    default:"none"
  }
});

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
    unique: true, // one cart per user
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0,
  },
  
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart =mongoose.model('Cart', cartSchema);
module.exports = Cart;

