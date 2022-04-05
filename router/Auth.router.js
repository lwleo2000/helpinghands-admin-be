const express = require("express");
const router = express.Router();
const passport = require("passport");
const Controller = require("../controller/Auth.controller");

router.post(
  "/login",
  function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
      console.log(err, 122);
      console.log(info, 55);
      if (info) {
        return res.status(400).send({
          status: "error",
          message: info.message,
        });
      }
      if (user) {
        req.user = user;
      }
      next();
    })(req, res);
  },
  Controller.Login
);
module.exports = router;
