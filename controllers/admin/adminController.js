const Category = require('../../models/categorySchema');
const User = require('../../models/userSchema')
const bcrypt = require("bcrypt");
require('dotenv').config()

const loadAdminLogin = async (req, res) => {
    try {
        res.render('admin/adminLogin',{layout:false})
    } catch (error) {
        res.status(500).json({message:"Error"})
    }
}

const loadAdminDashBoard = async(req,res)=>{
    try {
        res.render('admin/adminDashBoard', { currentPage: 'dashboard' })
    } catch (error) {
        res.status(500).json({message:"Error in loading AdminDashBoard"});    
    }

}

const adminLogin = async (req,res) => {
     const {email, password} = req.body
     
    try {
       
        const admin = await User.findOne({email});
       
        if(!admin.isAdmin){
            res.status(500).json({message:"You are  not a admin"})
        }

          if(admin){
                    const pass = bcrypt.compare(password, admin.password)
                    if(pass){
                        req.session.admin=admin;
                        res.json({success:true,redirectUrl:"/admin/dashboard",admin: req.session.admin})
                       
                    }else{

                        console.log("password not matching")
                    }
                }

        
        
    } catch (error) {
        res.status(500).json({message:"Your are not a Admin "})
       
    }
}



const loadUaserManage = async (req,res) => {
    try {
        res.render('admin/userManagement',{ currentPage: 'users' })
        
    } catch (error) {
        console.log("error in load userMangement" )
         res.status(500).json({message:"Error"})
        
    }
}



const adminLogout = async (req,res)=>{
    try {
        if (req.session.admin) {
      req.session.destroy(); 
    }
    res.redirect("/admin/login");
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}




module.exports = {
    loadAdminLogin,
    adminLogin,
    loadAdminDashBoard,
    loadUaserManage,
    adminLogout
   
  
}