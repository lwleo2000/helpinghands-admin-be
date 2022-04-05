const LoanPlanModel = require("../model/LoanPlan.model");
const LoanPlanManagementValidator = require("../Validator/LoanPlanManagement.validator");
const errorHandler = require("../tools/ErrorHandler/ErrorHandler");
const NumberGenerator = require("../plugin/NumberGenerator.plugin");
const Joi = require("@hapi/joi");
const { date } = require("joi");

exports.GetLoanPlanList = async (req, res) => {
  try {
    const loan_plan_list = await LoanPlanModel.aggregate([
      {
        $match: {
          deleted: false,
        },
      },
    ]).allowDiskUse(true);
    res.send({
      status: "ok",
      data: loan_plan_list,
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

exports.CreateLoanPlan = async (req, res) => {
  try {
    const validated_data = await Joi.validate(
      req.body,
      LoanPlanManagementValidator.CreateLoanPlan
    );
    console.log(validated_data, 1234);
    const new_loan_plan = await CreateLoanPlanModel(validated_data);
    console.log(new_loan_plan, 888);
    res.send({
      status: "ok",
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

exports.EditLoanPlan = async (req, res) => {
  try {
    const validated_data = await Joi.validate(
      req.body,
      LoanPlanManagementValidator.EditLoanPlan
    );
    console.log(validated_data, 555);
    const edit_loan_plan = await LoanPlanModel.findOneAndUpdate(
      {
        loan_plan_id: validated_data.loan_plan_id,
      },
      {
        $set: {
          title: validated_data.title,
          annual_interest_rate: validated_data.annual_interest_rate,
          max_loan: validated_data.max_loan,
        },
      }
    );
    console.log(edit_loan_plan, 222);
    res.send({
      status: "ok",
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

exports.LoanPlanAction = async (req, res) => {
  try {
    const validated_data = await Joi.validate(
      req.body,
      LoanPlanManagementValidator.LoanPlanAction
    );
    console.log(validated_data, 15556);
    if (validated_data.action === "deactivate") {
      const deactivate_loan_plan = await LoanPlanModel.findOneAndUpdate(
        {
          loan_plan_id: validated_data.loan_plan_id,
        },
        {
          $set: {
            activated: false,
          },
        }
      );
    } else if (validated_data.action === "activate") {
      const activate_loan_plan = await LoanPlanModel.findOneAndUpdate(
        {
          loan_plan_id: validated_data.loan_plan_id,
        },
        {
          $set: {
            activated: true,
          },
        }
      );
    } else if (validated_data.action === "delete") {
      const delete_loan_plan = await LoanPlanModel.findOneAndUpdate(
        {
          loan_plan_id: validated_data.loan_plan_id,
        },
        {
          $set: {
            deleted: true,
          },
        }
      );
    }
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

const CreateLoanPlanModel = async (data) => {
  const newLoanPlan = new LoanPlanModel();
  newLoanPlan.creation_date = Date.now();
  newLoanPlan.loan_plan_id = await NumberGenerator.LoanPlanIdNumberGenerator();
  newLoanPlan.title = data.title;
  newLoanPlan.max_loan = data.max_loan;
  newLoanPlan.annual_interest_rate = data.annual_interest_rate;
  newLoanPlan.activated = false;
  newLoanPlan.deleted = false;

  return await newLoanPlan.save();
};
