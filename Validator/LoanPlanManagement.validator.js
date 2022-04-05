const Joi = require("@hapi/joi");

module.exports = {
  CreateLoanPlan: Joi.object().keys({
    title: Joi.string().required(),
    annual_interest_rate: Joi.number().greater(0).required(),
    max_loan: Joi.number().greater(4999.99).less(30000.01).required(),
  }),
  EditLoanPlan: Joi.object().keys({
    loan_plan_id: Joi.string().required(),
    title: Joi.string().required(),
    annual_interest_rate: Joi.number().greater(0).required(),
    max_loan: Joi.number().greater(4999.99).less(30000.01).required(),
  }),
  LoanPlanAction: Joi.object().keys({
    loan_plan_id: Joi.string().required(),
    action: Joi.string().required(),
  }),
};
