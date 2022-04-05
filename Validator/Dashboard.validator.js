const Joi = require("@hapi/joi");

module.exports = {
  GetDashboardAnalytics: Joi.object().keys({
    start_date: Joi.date().timestamp("unix").required(),
    end_date: Joi.date().timestamp("unix").required(),
  }),
};
