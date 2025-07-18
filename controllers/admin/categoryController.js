const Category = require('../../models/categorySchema');
const Product = require('../../models/productSchema');
const Products = require('../../models/productSchema')
const bcrypt = require("bcrypt");
require('dotenv').config()
const slugify = require('slugify');


const loadCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim() || '';

    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const [categories, total] = await Promise.all([
      Category.find(query)
        .populate('parent', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Category.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.render('admin/category', {
      parentCategory: categories,
      currentPage: page,
      totalPages,
      searchQuery: search
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error loading categories' });
  }
};



const addCategory = async (req,res) => {
    try {
        const {name,parentId} = req.body ;

        
        const slug = slugify(name, { lower: true, strict: true });

        
        const existing = await Category.findOne({name:name})

     if(existing){
        return res.status(400).json({error :"Category is alredy exists"})
     }
    

     const newCategory = new Category({
        name:name,
        parent :parentId ||  null
     })

     await newCategory.save();
     res.status(200).json({message:"Category has been created",category:newCategory})
        
    } catch (error) {
        console.error("Add Category Error:", error.message);
        res.status(500).json({ error: 'Internal server error' });
        
    }
    
}

const updateCategory =async (req,res)=> {
    
    try {
        
        const { id } = req.params;
        let {name ,parent} = req.body;
      
    
        const slug = slugify(name, { lower: true, strict: true });
        
        if (!parent || parent === "") {
      
          parent = null;
        }
        
        const  isthere = await Category.findOne({name:name})

        if(isthere && isthere._id.toString() !== id){
             return res.status(500).json({success:false,message:"Category name  is already taken !!"})

        }

       const update = await Category.findById(id)

        if (!update) {
         return res.status(404).json({ success: false, message: 'Category not found',update });
        }

        update.name=name;
        update.slug =slug;
        update.parent=parent;
        update.createdAt = new Date();

        await update.save()

         res.status(200).json({ success: true, message: 'Category updated successfully', category: update });
        
    } catch (error) {

        res.status(500).json({success:false,message:"Error in update "})
        console.log("error in update")
        
    }
    
}


const   deleteCategory=async (req,res) => {

   

    try {
        const id = req.params.id;
        const category = await Category.findById(id);
        const allCategory = await Category.find({parent: id})
        const allCategoryIds = allCategory.map(sub => sub._id);
        const productsToUpdate = await Products.find({
            category: { $in: [id, ...allCategoryIds] }
        });
 

        if(category.isDeleted === false ){
          
            category.isDeleted=true
           
           for(let sub of allCategory){
            sub.isDeleted=true
           } 

           for (let product of productsToUpdate) {
                product.status = "discountinued";
                product.isActive=false;
                 product.isDeleted =true;
                await product.save();
            }




        }else{ 

            category.isDeleted=false
           for (let sub of allCategory) {
                sub.isDeleted = false;
                await sub.save(); 
            }

           for (let product of productsToUpdate) {
              const subCat = await Category.findById(product.category);
              if (!subCat?.isDeleted) {
                  product.status = "available";
                  product.isActive = true;
                  product.isDeleted = false;
                  await product.save();
              }
          }
             
        }

        await category.save()

        for(const subcategory of allCategory){
            await subcategory.save()
        }
        
      
       
      res.status(200).json({ success: true, message: 'Category updated successfully', category: {category,allCategory} });
    } catch (error) {
        
        res.status(500).json({success:false,message:"Error in update "})
        console.log("error in deleting")
    }
    
}





module.exports={
    loadCategory,
    addCategory,
    updateCategory,
    deleteCategory
}