const User = require("../../models/userSchema");
const Product = require("../../models/productSchema");
const Cart = require('../../models/cartSchema')
const Wishlist = require('../../models/wishlistSchema');
const mongoose = require("mongoose");
const { STATUS, MESSAGES } = require("../../utils/constants");
const AppError=require('../../utils/appError')


const loadwishList = async (req, res,next) => {
  try {
    let userId = req.session.user._id;
    const wishlist = await Wishlist.findOne({userId}).populate('products.productId');
    const user = await User.findById(userId);
    res.render("user/wishlist", { user: user,wishlist });
  } catch (error) {
    console.log("error in loadwishList", error);
    next(new AppError(MESSAGES.SERVER_ERROR,STATUS.SERVER_ERROR,))

  }
};


const addTowishlist = async (req, res) => {
  try {
    const productId = req.body.id
    let userId = req.session?.user?._id;
    let isWishList = false
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message:M});
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(401)
        .json({ success: false, message: "product is discontinued"});
    }
   
    
    let wishList = await  Wishlist.findOne({userId})

     if (!wishList) {
          wishList = new Wishlist({
            userId,
            products: [],
            totalItems: 0,
          });
        }
        let exitingItem = wishList.products.find((items) =>
      items.productId.equals(productId)
    );
    if(exitingItem){

        wishList.products = wishList.products.filter(item =>!item.productId.equals(productId));
      
        isWishList=false
        await wishList.save()
       
        return res.status(200).json({ success: true, message: "this  item  have removed from your wish list " ,isWishList});
    }else{
        wishList.products.push({
            productId:productId,
            addedOn: new Date()
        })
       
        isWishList =true
        
        await wishList.save()
         res.status(200).json({ success: true, message: "Added to Wish list" ,isWishList});
    }
    
    


  } catch (error) {
    console.error("addTowishlist:ERROR",error);
res.status(STATUS.SERVER_ERROR).json({ success: false, message: MESSAGES.SERVER_ERROR });


  }
};



const addToCart = async (req, res) => {
  try {
    const productId = req.body.id;
    const price = req.body.price;

    let userId = req.session?.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Login required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(401)
        .json({ success: false, message: "product is discontinued" });
    }

    if (product.quantity < 1)
      return res
        .status(401)
        .json({ success: false, message: "product is out of stock" });

    let userCart = await Cart.findOne({ userId });
    

    if (!userCart) {
      userCart = new Cart({
        userId,
        items: [],
        totalItems: 0,
      });
    }

    let exitingItem = userCart.items.find((items) =>
      items.productId.equals(productId)
    );

    if (exitingItem) {
      if (exitingItem.quantity >= 5) {
        return res
          .status(401)
          .json({ success: false, message: "you can only add  5 items" });
      } else {
        exitingItem.quantity += 1;
        exitingItem.total = exitingItem.quantity * price;
      }
    } else {
      let quantity = 1;
      userCart.items.push({
        productId: productId,
        quantity: quantity,
        price: product.salePrice,
        total: product.salePrice,
      });
    }  

    let wishList = await  Wishlist.findOne({userId})
     let inWishList = wishList.products.find((items) =>
      items.productId.equals(productId)
    );
    if(inWishList ){

        wishList.products = wishList.products.filter(item =>!item.productId.equals(productId));
      
        
        await wishList.save()}


    await userCart.save();

    res.json({ success: true, message: "Added to cart " });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(STATUS.SERVER_ERROR).json({ success: false, message:MESSAGES.SERVER_ERROR });
  }
};

const removeItem =async (req,res) => {

  try {
    const { id } = req.body;
    const userId = req.session.user._id;

    await Wishlist.updateOne(
      { userId },
      { $pull: { products: { productId: id } } }
    );

    res.json({ success: true });
    
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing from wishlist" });
    
  }
  
}




module.exports = {
  loadwishList,
  addTowishlist,
  addToCart,
  removeItem
};
