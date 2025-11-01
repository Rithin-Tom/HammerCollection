const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const userRouter = require("./routers/user/userRouter");
const adminRouter = require("./routers/admin/adminRouter");
const passport = require("./config/passport");
const User = require("./models/userSchema");
const errorHandler = require('./middlewares/errorHandiler');
const {STATUS,MESSAGES}=require('./utils/constants')

const expressLayout = require("express-ejs-layouts");

require("dotenv").config();
const DB = require("./config/db");
DB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayout);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use("/assets", express.static(path.join(__dirname, "/assets")));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", userRouter);

app.use("/admin", adminRouter);

app.get("/test-error", (req, res, next) => {
  next(new Error("Manual test error!"));
});

app.use((req, res) => {
  const view = req.originalUrl.startsWith("/admin")? "admin/error": "user/error";

  return res.status(STATUS.NOT_FOUND).render("user/error", {

    message: MESSAGES.PAGE_NOT_FOUND || "Page Not Found",
    status: STATUS.NOT_FOUND,
    user: req.session?.user || null,

  });

});

app.use(errorHandler);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
