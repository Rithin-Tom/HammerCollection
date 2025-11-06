const User = require("../../models/userSchema");

const  AppError = require('../../utils/appError')
const {STATUS,MESSAGES}=require('../../utils/constants')
const bcrypt = require("bcrypt");
const {
  generateOtp,
  sendVerificationEmail,
} = require("../../utils/otpServices");

const loadProfile = async (req, res,next) => {
  try {
    let userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError(MESSAGES.USER_NOT_FOUND || "User not found.", STATUS.NOT_FOUND));
    }

    res.render("user/userProfile", { user: user });
  } catch (error) {
    console.log("loadProfile:",error)

   next(new AppError(MESSAGES.SERVER_ERROR, STATUS.SERVER_ERROR));

  }
};

const  editProfile = async (req, res,next) => {
  try {
    let userId = req.session.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError(MESSAGES.USER_NOT_FOUND || "User not found.", STATUS.NOT_FOUND));
    }

    res.render("user/userProfileEdits", { user });
  } catch (error) {
    console.log("editProfile:",error)
   next(new AppError(MESSAGES.SERVER_ERROR,STATUS.SERVER_ERROR))
  }
};



const updateProfile = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { fullName, phoneNumber, emailAddress, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.USER_NOT_FOUND,
      });
    }

   
    const existingUser = await User.findOne({
      email: emailAddress,
      _id: { $ne: userId },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use. Please use another.",
      });
    }

    
    if (currentPassword && user.password) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(STATUS.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.PASSWORD_INCORRECT,
        });
      }
    }

    
    user.name = fullName || user.name;
    user.phone = phoneNumber || user.phone;
    user.email = emailAddress || user.email;

    
    if (newPassword && newPassword.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    return res.status(STATUS.SUCCESS).json({
      success: true,
      message: MESSAGES.USER_UPDATED,
      Url: "/profile",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res
      .status(STATUS.SERVER_ERROR)
      .json({ success: false, message: MESSAGES.SERVER_ERROR });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ success: false, message: MESSAGES.EMAIL_REQUIRED });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({
          success: false,
          message: MESSAGES.USER_ACCOUNT_NOT_FOUND,
          redirectUrl: "/signup",
        });
    }

    const otp = generateOtp();

    req.session.userOtp = otp;
    req.session.otpEmail = email;
    req.session.otpPurpose = "change-email";

     res.status(STATUS.SUCCESS).json({
      success: true,
      message: MESSAGES.OTP_SENT,
      redirectUrl: `/verify-otp?email=${encodeURIComponent(
        email
      )}&purpose=change-email`,
    });


    const emailSend = await sendVerificationEmail(email, otp);

    sendVerificationEmail(email, otp)
    .then(() => console.log("OTP sent to:", email,otp))
      .catch((err) => console.error("Failed to send OTP email:", err));


    if (!emailSend) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ success: false, message: "Failed to send OTP email." });
    }

    

    console.log("OTP for change email:", otp);

    


  } catch (error) {
    console.error("FindAccount Error:",error);
    return res
      .status(STATUS.SERVER_ERROR)
      .json({ success: false, message: MESSAGES.SERVER_ERROR, error });
  }
};

const uploadImage = async (req, res) => {
  try {
    let userId = req.session.user._id;
    const user = await User.findById(userId);

    if (user.profileImageId) {
      const { cloudinary } = require("../../utils/cloudinary");
      await cloudinary.uploader.destroy(user.profileImageId);
    }
    user.profileImage = req.file.path;
    user.profileImageId = req.file.filename;

    await user.save();

    return res
      .status(STATUS.SUCCESS)
      .json({ message: MESSAGES.USER_UPDATED, success: true });
  } catch (error) {
    res.status(STATUS.SERVER_ERROR).json({message:MESSAGES.SERVER_ERROR,success: false});
  }
};

module.exports = {
  loadProfile,
  editProfile,
  updateProfile,
  sendOtp,
  uploadImage,
};
