const User = require('../../models/userSchema');
const Product = require('../../models/productSchema');
const category = require('../../models/categorySchema');
const getProductsByMainCategory = require('../../services/productsByMainCategory');
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt");
const { sendVerificationEmail, generateOtp } = require('../../utils/otpServices');
const { findOneUserByEmail } = require('../../services/userAuthServices');

require("dotenv").config();




const loadHomepage = async (req,res) => {
    try {
     
          if(req.session.passport?.user){
             req.session.user =await User.findById(req.session.passport?.user)
          }

          const allImage =await Product.aggregate([{$sample:{size:15}}]);
          const marvel = await getProductsByMainCategory('Marvel',4)
          const dc = await getProductsByMainCategory('DC',4)
          const anime = await getProductsByMainCategory('Anime',4)




         res.render("user/userHome",{ layout: "layout/userLayout" ,user: req.session.user ,randomSlides:allImage,marvel,dc,anime });
    } catch (error) {
        console.log("problem to  load home page",error)
        res.status(500).send("server error")
        
    }
    
}





const loadLoginpage =async (req,res) => {
    try {
        res.render("user/login_page",{ user: req.session.user || null,noHeader: true,noFooter: true,})
    } catch (error) {
        console.log("error in load loginpage",error.message)
        res.status(500).send("server error ")

        
    }
    
}
const loadSignUPpage =async (req,res) => {
    try {
        res.render("user/signUp",{ noHeader: true, noFooter: true })
    } catch (error) {
        console.log("error in load loginpage",error.message)
        res.status(500).send("server error ")

        
    }
    
}


const signup = async (req,res) => {
  try {
    
    const {name,phone,password,cpassword,email}=req.body;

    if(password !== cpassword){
        return res.render("user/signup",{message:"PAssword do not match"})
    }

   

    const user = await findOneUserByEmail(email);
    if(!user){
    
      
      const otp = generateOtp();
      console.log("send OtP from singup",otp)
      const emailSend = await sendVerificationEmail(email,otp)
       if(!emailSend){
          return res.json("email-error")
       }
  
       req.session.userOtp = otp
       req.session.userData = {name,phone,email,password}
      console.log('hello',email)
   
       res.status(200).json({message: 'successfully sended', redirectUrl: `/verify-otp?email=${email}&purpose=signup`});
       
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
        res.status(500).send("server error")
    }
    
}

const securePassword= async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash
    } catch (error) {
        res.status(500).json({message:"Error"})
    }
}




const login = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email:email,isAdmin:false});
          if (!user) {
             return res.status(200).json({ message: 'user not found' , success: false })
       }
        if(user.isBlocked){
       
            
           return res.status(403).json({ success: false, message: "User is blocked by admin" });
        }

        

        if(user){

          if(user.password===undefined||user.password===null){
            return  res.status(403).json({ success: false, message: "Please Login with Google" });

          }
          
           const pass = await bcrypt.compare(password, user.password);

            if(pass){
                req.session.user=user;
                res.json({success:true,redirectUrl:"/",user:user})
            }else{
                return res.status(400).json({ success: false, message: "Incorrect password" });

            }
        }
    } catch (err) {
        console.error("JSON parse error:", err);
        console.log(err);
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
      const { email, purpose } = req.query;

    
    req.session.otpEmail = email;
    req.session.otpPurpose = purpose;

   
        if (!req.session.userOtp) {
      const otp = generateOtp();
      req.session.userOtp = otp;
      await sendVerificationEmail(email, otp);
    }



        res.render("user/otp_verify",{ noHeader: true , noFooter: true })
    } catch (error) {
        console.log("error in loading OTP  page",error.message)
        res.status(500).send("server error")
    }
}


const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.session.otpEmail;
     const purpose = Array.isArray(req.session.otpPurpose)
      ? req.session.otpPurpose[1]
      : req.session.otpPurpose;
    

    console.log("Verify", otp, "for", purpose);
    console.log("Submitted:", otp);
console.log("Stored OTP:", req.session.userOtp);


    if (otp === req.session.userOtp) {
      if (purpose === "signup") {
        const user = req.session.userData;
        const passwordHash = await securePassword(user.password);

        const saveUserData = new User({
          name: user.name,
          email: user.email,
          phone: user.phone,
          password: passwordHash
        });

        await saveUserData.save();
        req.session.userData = null;

        return res.json({ success: true, redirectUrl: "/login" });

      } else if (purpose === "forgot-password") {
       
        return res.json({ success: true, redirectUrl: `/reset-password?email=${encodeURIComponent(email)}` });
      }else if(purpose ==="change-email"){
        return res.json({ success: true, redirectUrl: `/profile/edit?email=${encodeURIComponent(email)}` });
      }

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
    

 
    const email = req.session?.userData?.email || req.query.email;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email not found in session." });
    }

    const emailSend = await sendVerificationEmail(email, newOtp);
    if (!emailSend) {
      return res.status(500).json({ success: false, message: "Failed to send email." });
    }

    console.log("New OTP sent:.", newOtp);
    res.json({ success: true });

  } catch (error) {
    console.log("Resend OTP Error:", error);
    res.status(500).json({ success: false, message: "Could not resend OTP" });
  }
};





const loadfindAccount = async (req,res) => {

  try {   
    res.render('user/findAccount',{ user: req.session.user || null,noHeader: true,noFooter: true,})
  } catch (error) {

     console.log("error in  loadfindaccout  page",error.message)
        res.status(500).send("server error")
    
  }
  
 } 

const findAccount = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Account not found.', redirectUrl: '/signup' });
    }

    
    const otp = generateOtp();
    const emailSend = await sendVerificationEmail(email, otp);

    if (!emailSend) {
      return res.status(500).json({ success: false, message: 'Failed to send OTP email.' });
    }

    req.session.userOtp = otp;
    req.session.otpEmail = email;
    req.session.otpPurpose = "forgot-password";

    console.log("OTP for forgot password:", otp);

    return res.status(200).json({
      success: true,
      message: 'Account found! OTP sent.',
      redirectUrl: `/verify-otp?email=${encodeURIComponent(email)}&purpose=forgot-password`
    });

  } catch (error) {
    console.error('FindAccount Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const resetPassword = async (req,res) => {
  try {
    res.render('user/resetPassword',{ user: req.session.user || null,noHeader: true,noFooter: true,})
  } catch (error) {


    
  }
  
}

const saveRestPassword = async (req,res) => {

  try {
    const {password} = req.body
    const email = req.session.otpEmail;


     if (!password || !email) {
      return res.status(400).json({ success: false, message: "Missing password or session expired." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await  User.findOneAndUpdate({email:email},{$set:{password:hashedPassword}})
    console.log(user)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    req.session.userOtp = null;
    req.session.otpEmail = null;
    req.session.otpPurpose = null;

    res.json({ success: true, message: "Password successfully updated!" });

    
  } catch (error) {

     console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error during password reset." });
    
  }
  
}

const loadCart = async (req,res) => {
  try {
    res.send("hello ")
  } catch (error) {
    
  }
  
}



module.exports={
    loadHomepage,
    loadLoginpage,
    loadSignUPpage,
    loadErrorpage,
    signup,
    loadOtp,
    verifyOtp,
    login,
    logout,
    resendOtp,
    resetPassword,
    loadfindAccount,
    findAccount,
    saveRestPassword,
    loadCart

    
}