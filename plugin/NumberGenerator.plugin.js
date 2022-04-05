const Moment = require("moment");
const { customAlphabet } = require("nanoid");
const LoanPlanModel = require("../model/LoanPlan.model");
const AdminModel = require("../model/Admin.model");
let nanoid = customAlphabet("0123456789", 10);

module.exports = {
  AdminAccountNumberGenerator: async () => {
    do {
      var account_number = await nanoid();
      account_number = "AD" + Moment().format("YYMM") + "-" + account_number;
      //check uniqueness of account number, email and phone number in database
      var data = await AdminModel.find({ account_number: account_number });
    } while (data.length !== 0);
    return account_number;
  },

  LoanPlanIdNumberGenerator: async () => {
    do {
      var id_number = await nanoid();
      id_number = "LP" + Moment().format("YYMM") + "-" + id_number;
      //check uniqueness of id number
      var data = await LoanPlanModel.find({ loan_plan_id: id_number });
    } while (data.length !== 0);
    return id_number;
  },
};
