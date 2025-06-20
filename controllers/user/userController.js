const User = require('../../models/userSchema');
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt");
const { sendVerificationEmail, generateOtp } = require('../../utils/otpServices');
const { findOneUserByEmail } = require('../../services/userAuthServices');
require("dotenv").config();




const loadHomepage = async (req,res) => {
    try {
         res.render("userHome",{ user: req.session.user });
    } catch (error) {
        console.log("problem to  load home page")
        res.satuts(500).send("server error")
        
    }
    
}

const loadLoginpage =async (req,res) => {
    try {
        res.render("login_page")
    } catch (error) {
        console.log("error in load loginpage",error.message)
        res.satuts(500).send("server error ")

        
    }
    
}
const loadSignUPpage =async (req,res) => {
    try {
        res.render("signUp")
    } catch (error) {
        console.log("error in load loginpage",error.message)
        res.satuts(500).send("server error ")

        
    }
    
}


const signup = async (req,res) => {
  try {
    const {name,phone,password,cpassword,email}=req.body;

    if(password !== cpassword){
        return res.render("signup",{message:"PAssword do not match"})
    }

    //check other fields...

    const user = await findOneUserByEmail(email);
    if(!user){
      console.log("hh");
      
      const otp = generateOtp();
      console.log("send OtP from singup",otp)
      const emailSend = await sendVerificationEmail(email,otp)
       if(!emailSend){
          return res.json("email-error")
       }
  
       req.session.userOtp = otp
       req.session.userData = {name,phone,email,password}
      
   
       res.status(200).json({message: 'successfully sended', redirectUrl: '/verify-otp'})
       
    }else{
      res.status((500)).json({message:"User already exist in this email"})
    }

  } catch (err) {
    res.status(500).json({message: err.message})
  }
    
}


const loadErrorpage = async (req,res) => {
    try {
        res.render("error")
    } catch (error) {
        console.log("error in loading ERROR page",error.message)
        res.satuts(500).send("server error")
    }
    
}

const securePassword= async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash
    } catch (error) {

    }
}




const login = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email});
        if(user.isBlocked){
          return res.status(500).json({success:false,message:"User is blocked by admin"})
        }

        if(user){
            const pass = bcrypt.compare(password, user.password)
            if(pass){
                req.session.user=user;
                res.json({success:true,redirectUrl:"/",user:user})
            }else{
                console.log("pass not matching")
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Error in login"})
        
    }
}

const logout = async (req, res) => {
  try {
    if (req.session.user) {
      req.session.destroy(); 
    }
    res.redirect("/login");
  } catch (error) {
    console.error("Logout error:", error);
    res.redirect("/");
  }
};

const loadOtp = async(req,res)=>{

  try {
        res.render("otp_verify")
    } catch (error) {
        console.log("error in loading OTP  page",error.message)
        res.satuts(500).send("server error")
    }
}


const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    console.log("Verifiy",otp)

    if (otp === req.session.userOtp) {
      const user = req.session.userData;
      const passwordHash = await securePassword(user.password);

      const saveUserData = new User({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: passwordHash
      });

      await saveUserData.save();
      req.session.user = null;
      res.json({ success: true, redirectUrl: "/login" });

    } else {
      res.status(400).json({ success: false, message: "Invalid OTP, please try again" });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const resendOtp = async (req, res) => {
  
  try {
    const newOtp = generateOtp();
    req.session.userOtp = newOtp;
    const { email } = req.session.userData;
    console.log("send OtP resend",newOtp)
    console.log(email)
    const emailSend = await sendVerificationEmail(email,newOtp)
    if(!emailSend){
      return res.json("email-error")
    }
    console.log("New OTP sent:", newOtp);

    res.json({ success: true });

  } catch (error) {
    console.log("Resend OTP Error:", error);
    res.status(500).json({ success: false, message: "Could not resend OTP" });
  }
};







module.exports={
    loadHomepage,
    loadLoginpage,
    loadSignUPpage,
    loadErrorpage ,
    signup,
    loadOtp,
    verifyOtp,
    login,
    logout,
    resendOtp
}