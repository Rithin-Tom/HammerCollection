const express  = require("express");
const app = express();
const path = require('path')
const session = require("express-session");
const userRouter = require("./routers/user/userRouter")
const adminRouter = require("./routers/admin/adminRouter")
const passport = require('./config/passport')

const expressLayout = require('express-ejs-layouts');

const env = require('dotenv').config()
const DB = require('./config/db');
DB()



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(expressLayout)
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    secure:false,
    httpOnly:true,
    maxAge:72*60*60*1000
  }
}))



app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});



app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.static('public'))
app.use('/assets',express.static(path.join(__dirname,"/assets")));


app.use(passport.initialize());
app.use(passport.session());



app.use('/',userRouter) ;

app.use("/admin",adminRouter)





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});