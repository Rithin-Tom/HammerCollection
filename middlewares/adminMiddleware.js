const Admin = require('../models/userSchema')

const loggedIn = async (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};

const loggedOut = async (req, res, next) => {
  if (!req.session.admin) {
    next();
  } else {
    res.redirect("/admin/dashboard");
  }
};

const checkAdminExists = async (req, res, next) => {
  try {
    const sessionAdmin = req.session.admin;
    console.log(sessionAdmin)

    
    if (!sessionAdmin) {
      res.locals.admin = null;
      return next();
    }

    
    const admin = await Admin.findById(sessionAdmin._id).lean();

    if (!admin) {
      req.session.admin = null;
      res.locals.admin = null;
      return next();
    }

    
    res.locals.admin = admin;
    next();
  } catch (err) {
    console.error("Error in checkAdminExists:", err);
    req.session.admin = null;
    res.locals.admin = null;
    next();
  }
};

module.exports = {
  loggedIn,
  loggedOut,
  checkAdminExists,
};
