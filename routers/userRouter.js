const express = require('express');
const router = express.Router();
const userController = require("../controllers/user/userController")



router.get("/",userController.loadHomepage)
router.get("/login",userController.loadLoginpage)
router.get("/signup",userController.loadSignUPpage)






module.exports = router;
