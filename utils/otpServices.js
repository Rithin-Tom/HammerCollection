const nodemailer = require('nodemailer');



function generateOtp(){
    return Math.floor(100000 +Math.random()*900000).toString();
}


async function sendVerificationEmail(email,otp){
    try {
        const transporter = nodemailer.createTransport({
            service:"gmail",
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.NODEMAILER_EMAIL,
                pass:process.env.NODEMAILER_PASSWORD
            }
        }) 
        const  info = await transporter.sendMail({
            from:process.env.NODEMAILER_EMAIL,
            to:email,
            subject:"Verify your accound",
            text:`Your OTP is ${otp}`,
            html:`<b>Your OTP :${otp}<b>`,
        })
        return info.accepted.length>0
        
    } catch (err) {
        throw new Error(err.message)       
        
    }

}



module.exports = { generateOtp, sendVerificationEmail }