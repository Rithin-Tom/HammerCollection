const User = require("../../models/userSchema");
const Address = require('../../models/addressSchema')
const bcrypt = require("bcrypt");
const { generateOtp, sendVerificationEmail } = require("../../utils/otpServices");


const loadAddressBook = async (req,res)=> {

    try {
        let userId = req.session.user._id
        const user = await User.findById(userId)
         let userAddress = await Address.findOne({user:userId})
    
      
            res.render('user/userAddressBook',{user:user,userAddress})
    
    } catch (error) {
        
    }

}



const AddAddress = async (req,res) => {
    try {
        let userId = req.session.user._id
        const user = await User.findById(userId)
       
        res.render('user/addAddress',{user:user})
        
    } catch (error) {
        
    }
    
}


const updateAddress = async (req,res) => {
    const { addressType, fullName, phone, altPhone,landMark,address, state, city, pincode } = req.body;
   
    try {

        const userId = req.session.user._id

        let userAddress = await Address.findOne({user:userId})
        

        const newAddress = {
              addressType,
              name:fullName,
              phone,
              altPhone,
              landMark,
              city,
              state,
              addressLine: address,
              pincode
        }

      
    if (!userAddress) {
      userAddress = new Address({
        user: userId,
        address: [newAddress],
      });
      await userAddress.save();

      return res.status(200).json({ success: true, message: "Address added successfully" });
    }

    
    if (userAddress.address.length >= 3) {
      const Url = "/profile/addAddress";
      return res.status(200).json({ success: false, message: "You can only add 3 addresses", Url });
    }

    
    userAddress.address.push(newAddress);
    await userAddress.save();

    res.status(200).json({ success: true, message: "Address added successfully" });

    } catch (error) {
         console.error("Error updating address:", error);
          res.status(500).json({ success: false, message: "Server Error" });
        
    }
    
}


const loadeditAddress = async (req,res) => {
    try {
        const index = req.params.index
        let userId = req.session.user._id
        const user = await User.findById(userId)
        let address =await Address.findOne({user:userId})
        const userAddress = address.address[index]
        
        res.render('user/editAddress',{user:user,userAddress,index})
    } catch (error) {
        
    }
    
}



const editAddress = async (req,res) => {
    const { addressType, fullName, phone, altPhone,landMark,address, state, city, pincode } = req.body;
    const index = req.params.index
    try {
        const userId = req.session.user._id

        let userAddress = await Address.findOne({user:userId})

        if(userAddress && userAddress.address && userAddress.address[index]){
            userAddress.address[index]={
                addressType:addressType,
                name:fullName,
                city:city,
                landMark:landMark,
                state:state,
                pincode:pincode,
                phone:phone,
                altPhone:altPhone,
                addressLine:address
            }
        }
        await userAddress.save()

       res.status(200).json({ success: true, message: "Address added successfully" });
        
    } catch (error) {
        console.error('Error updating address:', error);
        return res.status(500).json({ message: 'Server error', success: false });     
    }
    
}


   const  deleteAddress = async (req,res) => {
    const index = req.params.index
    
    try {
        const userId = req.session.user._id;

        const userAddress = await Address.findOne({user:userId})

        if(userAddress){
            userAddress.address.splice(index,1)

        }
        await userAddress.save()
         res.status(200).json({ success: true, message: "Address deleted successfully" });

        
    } catch (error) {
         console.error('Error updating address:', error);
        return res.status(500).json({ message: 'Server error', success: false });     
        
    }
    
   }


   
      module.exports={
         loadAddressBook,
         AddAddress,
         updateAddress,
         loadeditAddress,
         editAddress,
         deleteAddress,
        

      }