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
          
          match = password.toString() === user.password.toString();

          //const match = await bcrypt.compare(password, user.password);
          console.log("MATCH: ", match)
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
    done(null, user.user_id);
  });

  // Subsequent requests run deserializeUser instead of the full authenticate strategy
  passport.deserializeUser((user_id, done) => {
    pool.query('SELECT * FROM users WHERE user_id = $1', [user_id], (error, results) => {
      if (error) {
        done(error);
      }
      done(null, results.rows[0]); // Getting users information
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