const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const supabase = require('./services/supabaseDatabaseService');

function initializePassport(passport) {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const result = await supabase.from("users").select("*").eq("username", username);
                console.log("RESULT DATA: ", result.data)
                if (result.data.length > 0) {
                    const user = result.data[0];
                    console.log("USER, ", user);
                    match = password.toString() === user.password.toString();
                    console.log("MATCH, ", match)
                    //const match = await bcrypt.compare(password, user.password);
                    //console.log("MATCH: ", match)
                    if (match) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                } else {
                    return done(null, false, { message: 'User not found.' });
                }
            } catch (error) {
                    return done(error);
            }
        })
    );

    // Decides what data to attach to the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Subsequent requests run deserializeUser instead of the full authenticate strategy
    passport.deserializeUser((id, done) => {
        supabase.from("users").select("*").eq("id", id).then((result) => {
            done(null, result.data[0]);
        }).catch((error) => {
            done(error);
        });
    });

};


/*
passport.use(
  new GoogleStrategy(
    {
      clientID: 'your-google-client-id',
      clientSecret: 'your-google-client-secret',
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Implement Google OAuth authentication logic
    }
  )
);
*/

module.exports = initializePassport;