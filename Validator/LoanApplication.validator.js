const Joi = require("@hapi/joi");

module.exports = {
  GetLoanApplicationForm: Joi.object().keys({
    application_id: Joi.string().required(),
  }),

  VerifyLoanApplication: Joi.object().keys({
    application_id: Joi.string().required(),
    customer_id: Joi.string().required(),
    loan_amount: Joi.number().required(),
    loan_term: Joi.number().required(),
    loan_emi: Joi.number().required(),
    total_interest: Joi.number().required(),
    email: Joi.string().required(),
    action: Joi.string()
      .trim()
      .regex(
        /(^Rejected$)|(^Approved$)|(^Loan Disbursed$)|(^Suspended$)|(^Fully Paid$)/
      ),
    remarks: Joi.string().optional().allow(""),
  }),
};
