const express = require("express");
const router = express.Router();
const userMiddleware = require("../../middlewares/userMiddleware");
const userController = require("../../controllers/user/userController");
const userProductPage = require("../../controllers/user/userProductPage");
const { loadDetails } = require("../../controllers/user/productDetails");
const userCart = require("../../controllers/user/UserCart");
const userCheckOut = require("../../controllers/user/userCheckOut");
const userProfile = require("../../controllers/user/userProfile");
const userAddress = require("../../controllers/user/userAddress");
const userWishList = require("../../controllers/user/UserWishList")
const userOrders = require('../../controllers/user/userOrders')
const passport = require("passport");
const multer = require("multer");
const { storage } = require('../../utils/cloudinary');
const upload = multer({ storage });



router.use((req, res, next) => {
  res.locals.layout = "./layout/userLayout";

  res.locals.noHeader = false;
  res.locals.noFooter = false;
  res.locals.admin = null;
  next();
});

router.use(userMiddleware.checkUserExists)

router.get("/",userController.loadHomepage);

//shop page
router.get("/shop",userProductPage.loadShopPage);
router.post("/filter-products",userProductPage.filterProducts);

//productdetailPage

router.get("/product/:id", loadDetails);

// userProfile

router.get("/profile",userMiddleware.loggedIn, userProfile.loadProfile);

router.get("/profile/edit",userMiddleware.loggedIn, userProfile.editProfile);
router.post("/profile/email/edit-request",userMiddleware.loggedIn, userProfile.sendOtp);
router.put("/profile/", userMiddleware.loggedIn,userProfile.updateProfile);
router.post('/profile/uploadimage',userMiddleware.loggedIn,upload.single('profileImage'),userProfile.uploadImage)

// user address

router.get("/profile/addressBook", userMiddleware.loggedIn,userAddress.loadAddressBook);
router.get("/profile/addAddress",userMiddleware.loggedIn,userAddress.AddAddress);
router.put("/profile/addAddress",userMiddleware.loggedIn, userAddress.updateAddress);
router.get("/profile/editAddress/:index",userMiddleware.loggedIn, userAddress.loadeditAddress);
router.put("/profile/editAddress/:index", userMiddleware.loggedIn,userAddress.editAddress);
router.post("/profile/deleteAddress/:index",userMiddleware.loggedIn, userAddress.deleteAddress);

// cart
router.get("/cart",userMiddleware.loggedIn,userCart.loadCart);
router.post("/cart/add",userMiddleware.loggedIn,userCart.addToCart);
router.put("/cart/update", userMiddleware.loggedIn,userCart.updateQuantity);
router.delete("/cart/delete",userMiddleware.loggedIn, userCart.deleteItem);
// wishlist
router.get('/wishlist',userMiddleware.loggedIn,userWishList.loadwishList)
router.post('/wishlist/add',userMiddleware.loggedIn,userWishList.addTowishlist)
router.post('/wishList/cart/add',userMiddleware.loggedIn,userWishList.addToCart)
router.delete("/wishList/remove",userMiddleware.loggedIn,userWishList.removeItem)
// checkOut
router.get("/checkout", userMiddleware.loggedIn,userCheckOut.loadCheckOut);
router.post('/orderPlace',userMiddleware.loggedIn,userCheckOut.placeOrder)

// OrdersPage
router.get('/orders',userMiddleware.loggedIn,userOrders.loadOrders)


//   order deatals page 
router.get("/orders/:orderId",userMiddleware.loggedIn,userOrders.loadOrderDeatils)
router.get('/orders/invoice/:id',userMiddleware.loggedIn,userOrders.downloadInvoice)
router.post('/orders/cancel',userMiddleware.loggedIn,userOrders.cancelOrder)
router.post('/orders/return',userMiddleware.loggedIn,userOrders.returnProduct)


//login
router.get("/login", userMiddleware.loggedOut, userController.loadLoginpage);
router.post("/login", userMiddleware.loggedOut, userController.login);
// restpass
router.get("/reset-password", userController.resetPassword);
router.post("/reset-password", userController.saveRestPassword);
router.get("/find-accountPage", userController.loadfindAccount);
router.post("/find-account", userController.findAccount);
// signup
router.get("/signup", userMiddleware.loggedOut, userController.loadSignUPpage);
router.post("/signup", userMiddleware.loggedOut, userController.signup);

router.get("/verify-otp", userController.loadOtp);
router.post("/verify-otp", userController.verifyOtp);
router.post("/resend-otp", userController.resendOtp);

router.get("/logout", userMiddleware.loggedIn, userController.logout);


router.get("/auth/google",passport.authenticate("google", { scope: ["profile", "email"] }));
// router.get("/auth/google/callback",passport.authenticate("google", { failureRedirect: "/signup" }),(req, res) => {
//     res.redirect("/");
//   }
// );

router.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      // The "info" object contains our message (like 'Your account is blocked.')
      const errorMsg = info?.message || "Login failed. Please try again.";
      return res.redirect(`/login?error=${encodeURIComponent(errorMsg)}`);
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
});

module.exports = router;
