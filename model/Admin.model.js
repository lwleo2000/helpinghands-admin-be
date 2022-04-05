const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const AdminScehema = mongoose.Schema({
  creation_date: Date,
  account_number: String,
  full_name: String,
  email: String,
  phone_number: String,
  password: String,
  banned: Boolean,
  superadmin: Boolean,
});

AdminScehema.methods.generateJWT = function (e) {
  return jwt.sign(
    {
      id: e._id,
      email: e.email,
      banned: e.banned,
      superadmin: e.superadmin,
      phone_number: e.phone_number,
      account_number: e.account_number,
    },
    process.env.TOKEN_SECRET
  );
};

module.exports = mongoose.model("admin", AdminScehema, "admin");
