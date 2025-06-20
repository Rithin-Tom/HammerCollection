const  mongoose = require("mongoose");
const {Schema} = mongoose
const {v4:uuidv4} = require("uuid")


const orderItemSchema = new mongoose.Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});


const orderSchema = new Schema({
  orderId: {
    type: String,
    default:()=>uuidv4(),
    unique: true,
  },
  ordereditems: [orderItemSchema],
  paymentMethod: {
    type: String,
    enum: ['COD', 'Razorpay', 'Stripe', 'PayPal'],
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  discount:{
    type:Number,
    default:0,
    min:0
  },
  finalAmount:{
    type:Number,
    required:true
  },
  address:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  invoiceDate:{
    type:Date
  },
  status:{
    type:String,
    required:true,
    enum:['pending',"processing","shipped",'delivered','cancelled','return_request','returned']
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
   couponApplied:{
    type:Boolean,
    default:false
   },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;