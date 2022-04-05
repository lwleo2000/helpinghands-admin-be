const jwt = require("jsonwebtoken");
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
    const superadmin = req.user.superadmin;
    if (superadmin !== true) {
      return res.status(401).send({
        status: "error",
        message: "User is not superadmin",
      });
    }

    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};
