const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishlistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      addedOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  totalItems:{
    type: Number,
    default: 0,
  }
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
