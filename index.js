const express  = require("express");
const app = express();
const path = require('path')
const userRouter = require("./routers/userRouter")
const env = require('dotenv').config()
const DB = require('./config/db');
DB()


app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.set('view engine','ejs');
app.set('views',[path.join(__dirname,'views/user'),path.join(__dirname,'views/admin')]);
app.use(express.static('public'))


app.use('/',userRouter) ;


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});