const express = require('express');
const router = express.Router();



router.get('/login',(req,res)=>{
    res.render("/user/login_page")
})






module.exports = router;
