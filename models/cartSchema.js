const mongoose = require('mongoose');
const {Schema} = mongoose



const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product', 
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
  total: {
    type: Number,
    required: true,
  },
});

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, 
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.pre('save',function(next){
  this.totalItems = this.items.reduce((sum,items)=>sum +=items.quantity,0)
  this.totalPrice = this.items.reduce((sum,items)=>{
    return sum + items.quantity *items.price
  },0)
  this.updatedAt = new Date();
  next();
})

const Cart =mongoose.model('Cart', cartSchema);
module.exports = Cart;

