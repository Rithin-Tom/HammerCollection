const User = require("../../models/userSchema");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { STATUS, MESSAGES } = require("../../utils/constants");
const AppError=require('../../utils/appError')
const loadAdminLogin = async (req, res,next) => {
  try {
    res.render("admin/adminLogin", { layout: false });
  } catch (error) {
    next(new AppError(MESSAGES.SERVER_ERROR,STATUS.SERVER_ERROR,))
  }
};

const loadAdminDashBoard = async (req, res,next) => {
  try {
    res.render("admin/adminDashBoard", { currentPage: "dashboard" });
  } catch (error) {
    next(new AppError(MESSAGES.SERVER_ERROR,STATUS.SERVER_ERROR,))
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email });

    if (!admin.isAdmin) {
      res.status(500).json({ message: "You are  not a admin" });
    }

    if (admin) {
      const pass = bcrypt.compare(password, admin.password);
      if (pass) {
        req.session.admin = admin;
        res.json({
          success: true,
          redirectUrl: "/admin/dashboard",
          admin: req.session.admin,
        });
      } else {
        console.log("password not matching");
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Your are not a Admin ", error });
  }
};

const loadUaserManage = async (req, res) => {
  try {
    res.render("admin/userManagement", { currentPage: "users" });
  } catch (error) {
    console.log("error in load userMangement");
    res.status(500).json({ message: "Error", error });
  }
};

const adminLogout = async (req, res) => {
  try {
    if (req.session.admin) {
      req.session.destroy();
    }
    res.redirect("/admin/login");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};

module.exports = {
  loadAdminLogin,
  adminLogin,
  loadAdminDashBoard,
  loadUaserManage,
  adminLogout,
};
