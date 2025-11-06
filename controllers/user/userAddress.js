const User = require("../../models/userSchema");
const Address = require("../../models/addressSchema");
const { STATUS, MESSAGES } = require("../../utils/constants");
const AppError=require('../../utils/appError')

const loadAddressBook = async (req, res,next) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    let userId = req.session.user._id;
    const user = await User.findById(userId);
    let userAddress = await Address.findOne({ user: userId });

    res.render("user/userAddressBook", { user: user, userAddress });
  } catch (error) {
    console.log("loadAddressBook",error)
   next(new AppError(MESSAGES.SERVER_ERROR,STATUS.SERVER_ERROR,))
  }
};

const AddAddress = async (req, res,next) => {
  try {
    let userId = req.session.user._id;
    const user = await User.findById(userId);

    res.render("user/addAddress", { user: user });
  } catch (error) {
    console.log("AddAddress:",error)
    next(new AppError(MESSAGES.SERVER_ERROR,STATUS.SERVER_ERROR,))
  }
};

const updateAddress = async (req, res) => {
  const {
    addressType,
    fullName,
    phone,
    altPhone,
    landMark,
    address,
    state,
    city,
    pincode,
  } = req.body;

  try {
    const userId = req.session.user._id;

    let userAddress = await Address.findOne({ user: userId });

    const newAddress = {
      addressType,
      name: fullName,
      phone,
      altPhone,
      landMark,
      city,
      state,
      addressLine: address,
      pincode,
    };

    if (!userAddress) {
      userAddress = new Address({
        user: userId,
        address: [newAddress],
      });
      await userAddress.save();

      return res
        .status(STATUS.SUCCESS)
        .json({ success: true, message: MESSAGES.ADDRESS_ADDED });
    }

    // if (userAddress.address.length >= 3) {
    //   const Url = "/profile/addAddress";
    //   return res.status(200).json({ success: false, message: "You can only add 3 addresses", Url });
    // }

    userAddress.address.push(newAddress);
    await userAddress.save();

    res
      .status(STATUS.SUCCESS)
      .json({ success: true, message: MESSAGES.ADDRESS_ADDED });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(STATUS.SERVER_ERROR).json({ success: false, message: MESSAGES.SERVER_ERROR });
  }
};

const loadeditAddress = async (req, res,next) => {
  try {
    const index = req.params.index;
    let userId = req.session.user._id;
    const user = await User.findById(userId);
    let address = await Address.findOne({ user: userId });
    const userAddress = address.address[index];

    res.render("user/editAddress", { user: user, userAddress, index });
  } catch (error) {
    next(new AppError(MESSAGES.SERVER_ERROR,STATUS.SERVER_ERROR,))
  }
};

const editAddress = async (req, res) => {
  const {
    addressType,
    fullName,
    phone,
    altPhone,
    landMark,
    address,
    state,
    city,
    pincode,
  } = req.body;
  const index = req.params.index;
  try {
    const userId = req.session.user._id;

    let userAddress = await Address.findOne({ user: userId });

    if (userAddress && userAddress.address && userAddress.address[index]) {
      userAddress.address[index] = {
        addressType: addressType,
        name: fullName,
        city: city,
        landMark: landMark,
        state: state,
        pincode: pincode,
        phone: phone,
        altPhone: altPhone,
        addressLine: address,
      };
    }
    await userAddress.save();

    res
      .status(STATUS.SUCCESS)
      .json({ success: true, message:MESSAGES.ADDRESS_ADDED });
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(STATUS.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR, success: false });
  }
};

const deleteAddress = async (req, res) => {
  const index = req.params.index;

  try {
    const userId = req.session.user._id;

    const userAddress = await Address.findOne({ user: userId });

    if (userAddress) {
      userAddress.address.splice(index, 1);
    }
    await userAddress.save();
    res
      .status(STATUS.SUCCESS)
      .json({ success: true, message: MESSAGES.ADDRESS_DELETED });
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(STATUS.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR, success: false });
  }
};

module.exports = {
  loadAddressBook,
  AddAddress,
  updateAddress,
  loadeditAddress,
  editAddress,
  deleteAddress,
};
