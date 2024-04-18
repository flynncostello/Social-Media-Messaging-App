const LocalStrategy = require('passport-local').Strategy;
//const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const supabase = require('./services/supabaseDatabaseService');

// Used to initialize a session where session id for user is stored in cookies
// Session will remain until user logs out or session expires
function initializePassport(passport) {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const result = await supabase.from("users").select("*").eq("username", username);
                if (result.data.length > 0) {
                    const user = result.data[0];
                    const match = bcrypt.compareSync(password, user.password);
                    if (match) {
                        return done(null, user, { message: 'Logged in successfully' });
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                } else {
                    return done(null, false, { message: 'Username not found.' });
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

    passport.deserializeUser((id, done) => {
        if (!id) {
            done(null, false);
            return;
        } else {
            supabase.from("users").select("*").eq("id", id).then((result) => {
                if (result.data.length > 0) {
                    // User exists, continue as normal
                    done(null, result.data[0]);
                } else {
                    // User doesn't exist, log them out
                    done(null, false);
                }
            }).catch((error) => {
                done(error);
            });
        }
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