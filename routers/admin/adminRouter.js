const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path');
const fs = require('fs');
const adminController = require('../../controllers/admin/adminController')
const adminMiddileWare =require('../../middlewares/adminMiddleware');
const adminUserController=require('../../controllers/admin/adminUserController');
const categoryController = require('../../controllers/admin/categoryController');
const productController = require('../../controllers/admin/productController');



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/uploads');
    fs.mkdirSync(uploadPath, { recursive: true }); // Create folder if not exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|webp/;
    const ext = types.test(path.extname(file.originalname).toLowerCase());
    const mime = types.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only images are allowed'));
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});


router.use((req,res,next)=>{
        res.locals.layout = 'layout/adminLayout'

        res.locals.admin = req.session.admin || null;
        res.locals.currentPage =1;
        
        res.locals.noSideBar  = false;
        res.locals.noHeader = false;
        res.locals.noFooter = false;
        
        next();
});





// User management
router.get('/user-management',adminMiddileWare.loggedIn,adminUserController.loadUser );
router.post('/user-management/block/:id',adminUserController.blockUser)
router.get('/api/users',adminMiddileWare.loggedIn, adminUserController.getUsersList);


// product management
router.get('/api/products',adminMiddileWare.loggedIn, productController.getProducts);        
router.get('/products',adminMiddileWare.loggedIn,productController.loadProducts);
router.get('/addProduct',adminMiddileWare.loggedIn,productController.loadAddProducts);
router.get('/products/nameCheck',adminMiddileWare.loggedIn,productController.checkNameTaken);
router.post('/products/upload-image', upload.single('image'),productController.uploadProductImage);
router.post('/products/api/create',productController.createProduct);
router.get('/editProduct/:id',adminMiddileWare.loggedIn,productController.loadeditProducts);
router.put('/products/api/update/:id',productController.updateProducts);
router.delete('/api/products/:id',productController.deleteProduct);
router.delete('/products/api/delete/:id',productController.deleteProduct);
router.patch('/api/products/:id/delete-status',productController.deleteStatus);

// category management
router.get('/category',adminMiddileWare.loggedIn,categoryController.loadCategory);
router.post('/category',categoryController.addCategory);
router.put('/category/:id',categoryController.updateCategory);
router.delete('/category/:id',categoryController.deleteCategory);



router.get('/login',adminMiddileWare.loggedOut,adminController.loadAdminLogin);
router.post('/login',adminController.adminLogin);
router.get('/logout',adminController.adminLogout);

//Admin dashboard
router.get("/dashboard",adminMiddileWare.loggedIn,adminController.loadAdminDashBoard);
// router.get('/users',adminController.loadUaserManage)



module.exports=router;