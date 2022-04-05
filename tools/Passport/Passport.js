const passport = require("passport");
const AdminModel = require("../../model/Admin.model");
const bcrypt = require("bcryptjs");
var LocalStrategy = require("passport-local").Strategy;
module.exports = () => {
  // Allowing passport to serialize and deserialize users into sessions
  passport.serializeUser((user, done) => {
    console.log("serializing" + user);
    done(null, user);
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  //Phone number and password login
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
      },
      function (req, email, password, done) {
        process.nextTick(function () {
          AdminModel.findOne(
            {
              email: email,
            },
            function (err, user) {
              if (user) {
                console.log("User Login", user.full_name, user._id);
              }
              // if there are any errors, return the error
              if (err) return done(err);

              // if no user is found, return the message
              if (!user)
                return done(null, false, { message: "User not found" });

              if (!isValidPassword(user, password))
                return done(null, false, { message: "Invalid password" });

              if (user.banned) {
                return done(null, false, {
                  message: "User is banned from login",
                });
              }
              // all is well, return user
              else return done(null, user);
            }
          );
        });
      }
    )
  );
  var isValidPassword = function (user, password) {
    return bcrypt.compareSync(password, user.password);
  };
};
