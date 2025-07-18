const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userSchema');
const env = require('dotenv').config();



passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: "http://localhost:4000/auth/google/callback"

},

async (accessToken,refreshToken,profile,done) => {
    try {
      const email = profile.emails?.[0]?.value;

      let user = await User.findOne({
        $or: [{ googleId: profile.id }, { email }]
      });

      if (user) {
        // Link Google ID if it's missing
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      } else {
       
        const newUser = new User({
          name: profile.displayName,
          email,
          googleId: profile.id,
        });

        await newUser.save();
        return done(null, newUser);
      }


      
    } catch (err) {

       return done(err, null);
        
    }
    
}
)) ;


passport.serializeUser((user,done)=>{
  done(null,user.id)
});


passport.deserializeUser((id,done)=>{
    User.findById(id)
    .then(user =>{
        done(null,user)
    })
    .catch(err=>{
        done(err,null)
    })
})


module.exports= passport