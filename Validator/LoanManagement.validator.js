const Joi = require("@hapi/joi");

module.exports = {
  CompletePayment: Joi.object().keys({
    application_id: Joi.string().required(),
  }),
  EditEMIDueDate: Joi.object().keys({
    application_id: Joi.string().required(),
    new_emi_due_date: Joi.date().required(),
  }),
  AssignPenalty: Joi.object().keys({
    application_id: Joi.string().required(),
    penalty_fee: Joi.number().required(),
  }),
  GetPaymentDetails: Joi.object().keys({
    application_id: Joi.string().required(),
  }),
};
