const errorHandler = require("../tools/ErrorHandler/ErrorHandler");
const AdminModel = require("../model/Admin.model");

exports.Login = async (req, res) => {
  try {
    //Sign JWT token
    var Admin = new AdminModel();
    var Jwt_Token = Admin.generateJWT(req.user);
    return res.send({
      status: "ok",
      sign: "success",
      data: { jwt: Jwt_Token },
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

/*
============
* Function *
============
*/
