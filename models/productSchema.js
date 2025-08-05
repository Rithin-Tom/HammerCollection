const mongoose = require('mongoose')
const {Schema} = mongoose



const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  rating: { type: Number, required: true }, 
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new Schema({
    productName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true

    },    
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category",
        required:true,
    },
    regularPrice:{
        type:Number,
        required:true,
    },
    salePrice:{
        type:Number,
        required:true
    },
    productOffer:{
        type:Number,
        default:0,

    },
    quantity:{
        type:Number,
        default:true
    },
    maxCartQuantity:{
        type:Number,
        default:5
    },
    productImage:{
        type:[String],
        required:true
    },
    isActive:{
        type:Boolean,
        default:false
    },
    isFeatured:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:["available","sold_out","discountinued"],
        required:true,
        default:"available"
    },
    reviews: [reviewSchema],
    rating: {
         type: Number,
         default: 0
    },
    numReviews: {
         type: Number,
         default: 0
    },
    isDeleted: { 
    type: Boolean,
    default: false
  }


},{timestamps:true});


productSchema.pre('save',function (next){
    if( this.quantity==0){
        this.status ='sold_out'
    }else{
        this.status ='available'
    }
})

const Product = mongoose.model("Product",productSchema);
module.exports = Product;
