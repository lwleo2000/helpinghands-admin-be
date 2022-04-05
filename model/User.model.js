const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const UserScehema = mongoose.Schema({
  creation_date: Date,
  account_number: String,
  full_name: String,
  email: String,
  phone_number: String,
  password: String,
  banned: Boolean,
  active_loan: Number,
  stripe_customer_id: {
    type: String,
    default: undefined,
  },
  defaulter: {
    type: Boolean,
    default: undefined,
  },
});

module.exports = mongoose.model("user", UserScehema, "user");
