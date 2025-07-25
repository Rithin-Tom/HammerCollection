
const User = require("../../models/userSchema");
const bcrypt = require("bcrypt");


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

        console.log(req.body);
        

        let user =await User.findById(id)
         console.log(user);

        if(!user){
             return res.status(401).json({ message: 'user not found' , success: false })
        }

      if(currentPassword){
        if(user.password){
            if(!currentPassword || currentPassword.trim()==""){
                return res.status(401).json({ message: 'Current password is required', success: false })
            }
            }

            const isMatch = await bcrypt.compare(currentPassword,user.password)

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



// 


const loadAddressBook = async (req,res)=> {

    try {
        let userId = req.session.user._id
        const user = await User.findById(userId)
       
        res.render('user/userAddressBook',{user:user})
    } catch (error) {
        
    }

    
}
const loadAddAddress = async (req,res) => {
    try {
        let userId = req.session.user._id
        const user = await User.findById(userId)
       
        res.render('user/addAddress',{user:user})
        
    } catch (error) {
        
    }
    
}

module.exports={
    loadProfile,
    editProfile,
    updateProfile,
    loadAddressBook,
    loadAddAddress
}