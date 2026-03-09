const User = require("../models/userSchema");
const Cart = require("../models/cartSchema");

const loggedIn = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const loggedOut = async (req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
};

const checkUserExists = async (req, res, next) => {
  try {
    if (!req.session.user) {
      req.session.user = null;
      res.locals.user = null;
         res.locals.cartCount = 0;
      return next();
    }

    const user = await User.findById(req.session.user?._id)
      .lean()
      .select("-password");

    if (user.isBlocked) {
      req.session.user = null;
      res.locals.user = null;
      res.locals.cartCount = 0;
      return next();
    }

    res.locals.user = user;
     const cart = await Cart.findOne({ userId: user._id }).lean();
    res.locals.cartCount = cart ? cart.totalItems : 0;

    next();
  } catch (err) {
    console.log(err);
    req.session.user = null;
    res.locals.user = null;
    res.locals.cartCount = 0;
    next();
  }
};

module.exports = {
  loggedIn,
  loggedOut,
  checkUserExists,
};
