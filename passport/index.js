require("dotenv").config();
const Users = require("../models/users");

var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  FacebookStrategy = require("passport-facebook").Strategy,
  GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// Local email/password use
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    function(email, password, done) {
      Users.findOne({ email, password }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect login credentials." });
        }
        return done(null, user);
      });
    }
  )
);

// Facebook Login
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "name"]
    },
    function(accessToken, refreshToken, profile, done) {
      const { id, email, first_name, last_name } = profile._json;
      const userData = {
        email,
        first_name: first_name,
        last_name: last_name,
        password: "",
        facebook_id: id
      };
      Users.findOne(
        {
          facebook_id: id
        },
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            user = new Users({
              ...userData
            });
            user.save(function(err) {
              if (err) console.log(err);
              return done(err, user);
            });
          } else {
            //found user. Return
            return done(err, user);
          }
        }
      );
    }
  )
);

// Google Login
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    function(token, tokenSecret, profile, done) {
      const { id } = profile;
      const { given_name, family_name, picture, email} = profile._json;
      const userData = {
        email,
        first_name: given_name,
        last_name: family_name,
        password: "",
        google_id: id
      };
      Users.findOne(
        {
          google_id: id
        },
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            user = new Users({
              ...userData
            });
            user.save(function(err) {
              if (err) console.log(err);
              return done(err, user);
            });
          } else {
            //found user. Return
            return done(err, user);
          }
        }
      );
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;
