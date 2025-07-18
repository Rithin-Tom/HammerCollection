const Category = require('../../models/categorySchema');
const bcrypt = require("bcrypt");
const Product = require("../../models/productSchema");
const { render } = require('ejs');

require('dotenv').config()



const loadProducts = async (req, res) => {
    try {
       const categories =await Category.find()
      
       
        res.render('admin/product', { currentPage: 'products',categories:categories});
    } catch (error) {
        console.log("Error in load product page");
        res.status(500).send("Error loading page");
    }
};


const getProducts = async (req, res) => {
  
  console.o
    try {
        const { keyword, category, status, price } = req.query;
        console.log(req.query)

        const filter ={}
        if(keyword){
          filter.productName={$regex:keyword,$options:"i"}
        }
        if(category){
          const subcategories = await Category.find({ parent: category }).select('_id');
          const categoryIds = subcategories.map(c => c._id.toString());
          categoryIds.push(category);
          filter.category = { $in: categoryIds };
        }
        if (status === 'available') {
          filter.isActive = true;
        } else if (status === 'discountinued') {
          filter.isActive = false;
        } else if (status === 'sold_out') {
          filter.quantity = 0;
        }

        if (price) {
           if (price === '0-500') {
             filter.salePrice = { $gte: 0, $lte: 500 };
           } else if (price === '500-1000') {
             filter.salePrice = { $gt: 500, $lte: 1000 };
           } else if (price === '1000+') {
             filter.salePrice = { $gt: 1000 };
           }
         }

        const products = await Product.find(filter).populate('category').lean(); 
       
        res.json({ success: true, products});
       
    } catch (error) {
        console.error("API error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const loadAddProducts =async (req,res) => {
    try {
        const categories  = await Category.find({  isDeleted: false ,parent:{$ne:null} });
        res.render('admin/addProduct',{ messages: null, categories , brands : [] })
    } catch (error) {
        res.render('admin/addProduct',{ messages: err.message })
    }
    
}
const checkNameTaken =async (req,res) => {
   const name = req.query.name?.trim()
  
  if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
  try {
     const existingProduct = await Product.findOne({ name: new RegExp('^' + name + '$', 'i') }); 
    if (existingProduct) {
      return res.json({ success: true, exists: true });
    }
    return res.json({ success: true, exists: false });
  
  } catch (error) {
     return res.status(500).json({ success: false, message: 'Server error' });
  }
  
}


const uploadProductImage =async(req,res)=>{
     
    try {
        if(!req.file){ return res.json({success:false,message:"no image uploaded"})}
        const imageUrl = `uploads/${req.file.filename}`;
       


        res.json({success:true,imageUrl})
    

    } catch (error) {
        console.log("errror in uploading image")
    }

}

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      regularPrice,
      salePrice,
      stock,
      maxCartQuantity,
      images,
      isActive,
      isFeatured
    } = req.body;


    const existingProduct = await Product.findOne({
      productName: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        errors: { name: 'A product with this name already exists.' }
      });
    }

    const newProduct = new Product({
      productName: name,
      description,
      category,
      regularPrice,
      salePrice,
      maxCartQuantity,
      quantity: stock,
      productImage: images,
      isActive,
      isFeatured
    });

    await newProduct.save();
    res.json({ success: true, message: 'New product added successfully' });

  } catch (error) {
    console.error('Error in saving new product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const loadeditProducts = async (req,res)=>{
    try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate('category');
    const categories  = await Category.find({  isDeleted: false ,parent:{$ne:null} });
    

    if (!product) {
      return res.status(404).send('Product not found');
    }


    res.render('admin/editProduct', { product,messages:null,brand:[],categories});
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
}

const updateProducts = async (req, res) => {
  try {
    const id = req.params.id;
    const { productName } = req.body;
    

    const existingProduct = await Product.findOne({
      _id: { $ne: id },
      productName: { $regex: new RegExp(`^${productName}$`, 'i') }
    });
    

    if (existingProduct) {
      return res.status(400).json({ 
        success: false, 
        errors: { name: 'A product with this name already exists.' }
      });
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
 
    try {
        const productId = req.params.id;
      
        

        const deleted = await Product.findByIdAndDelete(productId);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteStatus = async (req,res) => {
  const { id } = req.params;
    const bf = await Product.findById(id)
   
  try {
    
    const { isDeleted } = req.body;
  
    await  Product.findByIdAndUpdate(id, { isDeleted });
    
     res.json({ success: true });
    
  } catch (error) {

       console.error('Error updating delete status:', error);
      res.status(500).json({ success: false, message: 'Failed to update product status.' });
    
  }
  
}



module.exports={
     loadProducts,
    loadAddProducts,
    deleteStatus,
     uploadProductImage,
     createProduct,
     getProducts,
     loadeditProducts,
     updateProducts,
     deleteProduct,
     checkNameTaken
   
}