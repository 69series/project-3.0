require('dotenv').config();
const User = require('../models/user');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try {
        // first check by googleId
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // check if email already exists (signed up with email/password before)
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // link google to existing account
                user.googleId = profile.id;
                user.isVerified = true;
                await user.save();
                console.log('Google linked to existing account!', user);
            } else {
                // brand new user
                user = await User.create({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    isVerified: true,
                });
                console.log('New user created!', user);
            }
        } else {
            console.log('User already exists!', user);
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});