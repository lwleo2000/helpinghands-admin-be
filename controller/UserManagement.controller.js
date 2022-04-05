const AdminModel = require("../model/Admin.model");
const UserModel = require("../model/User.model");
const NumberGenerator = require("../plugin/NumberGenerator.plugin");
const bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");
const UserManagementValidator = require("../Validator/UserManagement.validator");
const errorHandler = require("../tools/ErrorHandler/ErrorHandler");

exports.RegisterAdminAccount = async (req, res) => {
  try {
    const validated_data = await Joi.validate(
      req.body,
      UserManagementValidator.RegisterAdminAccount
    );
    console.log(validated_data, 555);
    const full_name = validated_data.full_name;
    const phone_number = validated_data.phone_number;
    const email = validated_data.email;
    const password = validated_data.password;

    if ((await CheckEmailExist(email)) === true) {
      return res.status(400).send({
        status: "error",
        message: "User existed",
      });
    }

    const new_account = await CreateNewAdmin(
      full_name,
      phone_number,
      email,
      password
    );
    console.log(new_account, 888);

    res.send({
      status: "ok",
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

exports.GetAdminList = async (req, res) => {
  try {
    const admin_list = await AdminModel.find();
    console.log(admin_list, 5566);
    res.send({
      status: "ok",
      data: admin_list,
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

exports.GetUserList = async (req, res) => {
  try {
    const user_list = await UserModel.find();
    console.log(user_list, 5566);
    res.send({
      status: "ok",
      data: user_list,
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

exports.BanAdminAccount = async (req, res) => {
  try {
    const validated_data = await Joi.validate(
      req.body,
      UserManagementValidator.BanAdminAccount
    );
    console.log(validated_data, 1234);
    const ban_admin_account = await AdminModel.findOneAndUpdate(
      {
        account_number: validated_data.account_number,
      },
      {
        $set: {
          banned: validated_data.action === "ban" ? true : false,
        },
      }
    );
    res.send({
      status: "ok",
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

exports.BanUserAccount = async (req, res) => {
  try {
    const validated_data = await Joi.validate(
      req.body,
      UserManagementValidator.BanUserAccount
    );
    console.log(validated_data, 1234);
    const ban_user_account = await UserModel.findOneAndUpdate(
      {
        account_number: validated_data.account_number,
      },
      {
        $set: {
          banned: validated_data.action === "ban" ? true : false,
        },
      }
    );
    res.send({
      status: "ok",
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

exports.UnsetDefaulter = async (req, res) => {
  try {
    const validated_data = await Joi.validate(
      req.body,
      UserManagementValidator.UnsetDefaulter
    );
    console.log(validated_data, 1234);
    const unset_defaulter = await UserModel.findOneAndUpdate(
      {
        account_number: validated_data.account_number,
      },
      {
        $set: {
          defaulter: false,
        },
      }
    );
    res.send({
      status: "ok",
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

const CreateNewAdmin = async (full_name, phone_number, email, password) => {
  //Check if the user is already in the database
  const newAdmin = new AdminModel();
  newAdmin.creation_date = Date.now();
  newAdmin.account_number = await NumberGenerator.AdminAccountNumberGenerator();
  newAdmin.full_name = full_name;
  newAdmin.email = email;
  newAdmin.phone_number = phone_number;
  newAdmin.password = await HashPassword(password);
  newAdmin.banned = false;
  newAdmin.superadmin = false;

  return await newAdmin.save();
};

const HashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

const CheckEmailExist = async (email) => {
  const emailExist = await AdminModel.findOne({ email: email });
  if (emailExist === null) {
    return false;
  } else return true;
};
