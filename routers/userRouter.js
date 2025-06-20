const express = require('express');
const router = express.Router();
const userMiddleware = require('../middlewares/userMiddleware');
const userController = require("../controllers/user/userController")
// const userMiddleware = require('../middlewares/userMiddleware')



router.get("/",userController.loadHomepage)

router.get("/login",userMiddleware.loggedOut,userController.loadLoginpage)
router.post('/login',userMiddleware.loggedOut, userController.login)

router.get("/signup",userMiddleware.loggedOut,userController.loadSignUPpage)
router.post("/signup",userMiddleware.loggedOut,userController.signup)

router.get("/verify-otp",userMiddleware.loggedOut,userController.loadOtp)
router.post("/verify-otp",userMiddleware.loggedOut,userController.verifyOtp)
router.post("/resend-otp",userMiddleware.loggedOut, userController.resendOtp);

router.get("/logout",userMiddleware.loggedIn,userController.logout)






module.exports = router;
