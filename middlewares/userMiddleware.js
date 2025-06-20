const User = require('../models/userSchema')

const loggedIn = async (req, res, next) => {
    if(req.session.user){
        next()
    }else{
        res.redirect('/login')
    }
}

const loggedOut = async (req, res, next) => {
    
    
    if(!req.session.user){
        next()
    }else{
        res.redirect('/')
    }
}

module.exports = {
    loggedIn,
    loggedOut
}