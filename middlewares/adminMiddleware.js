const User = require('../models/userSchema')


const loggedIn = async (req, res, next) => {
    if(req.session.admin){
        next()
    }else{
        res.redirect('/admin/login')
    }
}


const loggedOut = async (req, res, next) => {
    
    
    if(!req.session.admin){
        next()
    }else{
        res.redirect('/admin/dashboard')
    }
}


module.exports={
    loggedIn,
    loggedOut
}
