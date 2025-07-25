const User = require('../../models/userSchema');
const Product = require('../../models/productSchema');
const category = require('../../models/categorySchema');





const loadDetails = async(req,res)=>{
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).send("Product not found");
    }

       const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4).lean();
    
    
    res.render('user/productDetailPage',{user: req.session.user,product,relatedProducts})
    
  } catch (error) {

       console.log("error in load  loadDetails",error.message)
        res.status(404)
        res.render('user/error',{user:null,noHeader: true, noFooter: true })
        

  }
}

module.exports ={
    loadDetails
}