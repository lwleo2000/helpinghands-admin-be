const mongoose = require("mongoose");

const LoanPlanScehema = mongoose.Schema({
  creation_date: Date,
  loan_plan_id: String,
  title: String,
  max_loan: Number,
  annual_interest_rate: Number,
  activated: Boolean,
  deleted: Boolean,
  superadmin: Boolean,
});

module.exports = mongoose.model("loan_plan", LoanPlanScehema, "loan_plan");
