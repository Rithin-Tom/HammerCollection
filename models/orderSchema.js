const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name:{
    type:String,
    require:true

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
    default: () => uuidv4(),
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderedItems: [orderItemSchema],
  paymentMethod: {
    type: String,
    enum: ["COD", "UPI", "Card", "NetBanking", "Wallet"],
    required: true,
  },
  orderStatus: {
    type: String,
    enum: [
      "Processing",
      "Shipped",
      "Out for delivery",
      "Delivered",
      "Cancelled",
      "Returned",
      "ReturnRequested",
      "ReturnRejected",
    ],
    default: "Processing",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  cancellation: {
    isRequested: { type: Boolean, default: false },
    reason: { type: String },
    requestedAt: { type: Date },
  },
  returnRequest: {
    isRequested: { type: Boolean, default: false },
    reason: { type: String },
    requestedAt: { type: Date },
    approvedAt: { type: Date },
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
  address: {
    addressType: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    landMark: { type: String },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    phone: { type: String, required: true },
    altPhone: { type: String },
    addressLine: { type: String, required: true },
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  invoiceDate: {
    type:String,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  couponApplied: {
    type: Boolean,
    default: false,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
