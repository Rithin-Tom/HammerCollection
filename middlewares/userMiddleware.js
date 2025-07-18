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


const checkUserExists = async (req,res,next) => {

    try{

        if(!req.session.user){
            req.session.user = null;
            res.locals.user = null;
            return next()
        }

        const user = await User.findById(req.session.user?._id).lean().select('-password')

       
        

        if(user.isBlocked){
            req.session.user = null;
            res.locals.user = null;
           return next()
        }

        res.locals.user = user
        next();

    }catch(err){
        req.session.user = null
        res.locals.user = null;
        next()

    }

}

module.exports = {
    loggedIn,
    loggedOut,
    checkUserExists
}