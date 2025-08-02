
const User = require("../../models/userSchema");
const Address = require('../../models/addressSchema')
const bcrypt = require("bcrypt");
const { generateOtp, sendVerificationEmail } = require("../../utils/otpServices");


const loadProfile = async(req,res)=>{
    try {
        let userId = req.session.user._id
         const user = await User.findById(userId)
       
        res.render('user/userProfile',{user:user})
       
        
    } catch (error) {
        
    }
}




const editProfile = async (req,res) => {
    try {
         let userId = req.session.user._id
         const user = await User.findById(userId)

        res.render('user/userProfileEdits',{user})
    } catch (error) {



        
    }    
}



const updateProfile =async (req,res) => {
    try {
        let userId = req.session.user
        let {fullName,phoneNumber,emailAddress,currentPassword,newPassword}=req.body
        const id= userId._id

       
        

        let user =await User.findById(id)
         

        if(!user){
             return res.status(401).json({ message: 'user not found' , success: false })
        }

      if(currentPassword){
        if(user.password){
            if(!currentPassword || currentPassword.trim()==""){
                return res.status(401).json({ message: 'Current password is required', success: false })
            }
            }

            const isMatch =  bcrypt.compare(currentPassword,user.password)

               if(!isMatch){
                return res.status(401).json({message:"Incorrect current password ",success:false})
             }
        }

        
        user.name = fullName;
        if(phoneNumber){
            user.phone = phoneNumber;}
         user.email = emailAddress;
        
        

         if (newPassword && newPassword.trim() !== '') {
             const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
             }
        

          await user.save();

          let Url = '/profile'

          return res.status(200).json({ Url,message: 'Profile updated successfully', success: true });
        
       
        
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Server error', success: false });
        
    }
    
}



    

      const sendOtp = async (req,res) => {
       
       try {
           const { email } = req.body;
   
           if (!email) {
             return res.status(400).json({ success: false, message: 'Email is required.' });
           }
           const user = await User.findOne({ email });
               if (!user) {
                 return res.status(400).json({ success: false, message: 'Account not found.', redirectUrl: '/signup' });
               }
           
               const otp = generateOtp()
               const emailSend = await sendVerificationEmail(email,otp)
   
                if (!emailSend) {
         return res.status(500).json({ success: false, message: 'Failed to send OTP email.' });
       }
   
         req.session.userOtp = otp;
         req.session.otpEmail = email;
         req.session.otpPurpose = "change-email";
   
       console.log("OTP for change email:", otp);
       return res.status(200).json({
         success: true,
         message: 'Account found! OTP sent.',
         redirectUrl: `/verify-otp?email=${encodeURIComponent(email)}&purpose=change-email`
       });
   
       } catch (error) {
           console.error('FindAccount Error:', error);
       return res.status(500).json({ success: false, message: 'Server error' });
       }
       
      }
   











module.exports={
    loadProfile,
    editProfile,
    updateProfile,
    sendOtp
}