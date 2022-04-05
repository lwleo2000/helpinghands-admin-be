const jwt = require("jsonwebtoken");
const AdminModel = require("../model/Admin.model");
module.exports = async function ValidateAdmin(req, res, next) {
  var JWT_Token = req.headers.authorization;
  if (!JWT_Token) {
    return res.status(401).send({
      status: "error",
      message: "Token not found",
    });
  }

  try {
    const verified = jwt.verify(JWT_Token, process.env.TOKEN_SECRET);
    req.user = verified;
    const account_number = req.user.account_number;
    const admin = await AdminModel.findOne({
      account_number: account_number,
    });
    const banned = admin.banned;
    if (banned === true) {
      return res.status(401).send({
        status: "error",
        message: "User is banned from login",
      });
    }
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};
