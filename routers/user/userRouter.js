const express = require('express');
const router = express.Router();
const userMiddleware = require('../../middlewares/userMiddleware');
const userController = require("../../controllers/user/userController")
const userProductPage = require("../../controllers/user/userProductPage");
const { loadDetails } = require('../../controllers/user/productDetails');
const userProfile =require('../../controllers/user/userProfile')
const passport = require('passport');


router.use((req,res,next)=>{
        res.locals.layout = './layout/userLayout'

   
        res.locals.noHeader = false;
        res.locals.noFooter = false;
        res.locals.admin = null;
        next();
});


router.get("/",userMiddleware.checkUserExists,userController.loadHomepage)

//shop page
router.get("/shop",userMiddleware.checkUserExists,userProductPage.loadShopPage);
router.post('/filter-products',userMiddleware.checkUserExists,userProductPage.filterProducts)

//productdetailPage

router.get('/product/:id',loadDetails)


// userProfile

router.get('/profile',userProfile.loadProfile)
router.get('/profile/edit/:id',userProfile.editProfile)
router.put('/profile/',userProfile.updateProfile)

router.get('/profile/addressBook',userProfile.loadAddressBook)
router.get('/profile/addAddress',userProfile.loadAddAddress)

//login


router.get("/login",userMiddleware.loggedOut,userController.loadLoginpage)
router.post('/login',userMiddleware.loggedOut, userController.login)

router.get('/reset-password',userController.resetPassword)
router.post('/reset-password',userController.saveRestPassword);
router.get('/find-accountPage',userController.loadfindAccount)
router.post('/find-account',userController.findAccount)

router.get("/signup",userMiddleware.loggedOut,userController.loadSignUPpage)
router.post("/signup",userMiddleware.loggedOut,userController.signup)

router.get("/verify-otp",userMiddleware.loggedOut,userController.loadOtp)
router.post("/verify-otp",userMiddleware.loggedOut,userController.verifyOtp)
router.post("/resend-otp",userMiddleware.loggedOut, userController.resendOtp);

router.get("/logout",userMiddleware.loggedIn,userController.logout)

// passport seting route
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/signup'}),(req,res)=>{
        res.redirect('/')
})
// 






module.exports = router;
