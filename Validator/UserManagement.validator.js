const Joi = require("@hapi/joi");

module.exports = {
  RegisterAdminAccount: Joi.object().keys({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string()
      .trim()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]{8,}$/)
      .required(),
    full_name: Joi.string().required(),
    phone_number: Joi.string().trim().required(),
  }),
  BanAdminAccount: Joi.object().keys({
    account_number: Joi.string().required(),
    action: Joi.string().required(),
  }),
  BanUserAccount: Joi.object().keys({
    account_number: Joi.string().required(),
    action: Joi.string().required(),
  }),
  UnsetDefaulter: Joi.object().keys({
    account_number: Joi.string().required(),
  }),
};
