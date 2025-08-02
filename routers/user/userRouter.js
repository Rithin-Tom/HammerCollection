const express = require('express');
const router = express.Router();
const userMiddleware = require('../../middlewares/userMiddleware');
const userController = require("../../controllers/user/userController")
const userProductPage = require("../../controllers/user/userProductPage");
const { loadDetails } = require('../../controllers/user/productDetails');
const userCart =require('../../controllers/user/UserCart');
const userCheckOut = require('../../controllers/user/userCheckOut');
const userProfile = require('../../controllers/user/userProfile');
const userAddress=require('../../controllers/user/userAddress');
const passport = require('passport');


router.use((req, res, next) => {
        res.locals.layout = './layout/userLayout'


        res.locals.noHeader = false;
        res.locals.noFooter = false;
        res.locals.admin = null;
        next();
});


router.get("/", userMiddleware.checkUserExists, userController.loadHomepage)

//shop page
router.get("/shop", userMiddleware.checkUserExists, userProductPage.loadShopPage);
router.post('/filter-products', userMiddleware.checkUserExists, userProductPage.filterProducts)

//productdetailPage

router.get('/product/:id', loadDetails)

// userProfile

router.get('/profile', userProfile.loadProfile)

router.get('/profile/edit', userProfile.editProfile)
router.post('/profile/email/edit-request',userProfile.sendOtp)
router.put('/profile/', userProfile.updateProfile)

// user address

router.get('/profile/addressBook', userAddress.loadAddressBook)
router.get('/profile/addAddress', userAddress.AddAddress)
router.put("/profile/addAddress",userAddress.updateAddress)
router.get('/profile/editAddress/:index',userAddress.loadeditAddress);
router.put('/profile/editAddress/:index',userAddress.editAddress)
router.post('/profile/deleteAddress/:index',userAddress.deleteAddress)

// cart
router.get('/cart',userCart.loadCart)
router.post('/cart/add',userCart.addToCart)
router.put('/cart/update',userCart.updateQuantity)
router.delete('/cart/delete',userCart.deleteItem)
// checkOut
router.get('/checkout', userCheckOut.loadCheckOut)

//login
router.get("/login", userMiddleware.loggedOut, userController.loadLoginpage)
router.post('/login', userMiddleware.loggedOut, userController.login)
// restpass
router.get('/reset-password', userController.resetPassword)
router.post('/reset-password', userController.saveRestPassword);
router.get('/find-accountPage', userController.loadfindAccount)
router.post('/find-account', userController.findAccount)
// signup
router.get("/signup", userMiddleware.loggedOut, userController.loadSignUPpage)
router.post("/signup", userMiddleware.loggedOut, userController.signup)

router.get("/verify-otp", userController.loadOtp)
router.post("/verify-otp", userController.verifyOtp)
router.post("/resend-otp", userController.resendOtp);

router.get("/logout", userMiddleware.loggedIn, userController.logout)

// passport seting route
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/signup' }), (req, res) => {
        res.redirect('/')
})
// 






module.exports = router;
