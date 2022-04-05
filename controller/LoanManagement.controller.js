const errorHandler = require("../tools/ErrorHandler/ErrorHandler");
const Joi = require("@hapi/joi");
const LoanManagementValidator = require("../Validator/LoanManagement.validator");
const LoanApplicationModel = require("../model/LoanApplication.model");
const UserModel = require("../model/User.model");
const moment = require("moment");

exports.CompletePayment = async (req, res) => {
  try {
    const validated_data = await Joi.validate(
      req.body,
      LoanManagementValidator.CompletePayment
    );
    console.log(validated_data, 1234);
    const loan_application = await LoanApplicationModel.findOne({
      application_id: validated_data.application_id,
    });
    const new_emi_due_date = moment(loan_application.payment.emi_due_date)
      .add(1, "months")
      .toDate();
    const new_total_repayment = parseFloat(
      loan_application.payment.total_repayment +
        loan_application.emi_plan.loan_emi
    ).toFixed(2);
    const new_emi_paid = loan_application.payment.emi_paid + 1;
    //If emi paid equal to loan term means the loan is fully repaid
    var new_loan_status;
    if (new_emi_paid === loan_application.emi_plan.loan_term) {
      new_loan_status = "Fully Paid";
    } else {
      new_loan_status = "Loan Disbursed";
    }
    console.log(
      validated_data.application_id,
      new_emi_due_date,
      new_total_repayment,
      new_emi_paid,
      333
    );
    const updated = await LoanApplicationModel.findOneAndUpdate(
      {
        application_id: validated_data.application_id,
      },
      {
        $set: {
          loan_status: new_loan_status,
          "payment.emi_due_date": new_emi_due_date,
          "payment.total_repayment": new_total_repayment,
          "payment.emi_paid": new_emi_paid,
        },
      }
    );
    console.log(updated, 5566);
    res.send({
      status: "ok",
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

exports.EditEMIDueDate = async (req, res) => {
  try {
    const validated_data = await Joi.validate(
      req.body,
      LoanManagementValidator.EditEMIDueDate
    );
    console.log(validated_data, 1234);

    const updated_loan_application =
      await LoanApplicationModel.findOneAndUpdate(
        {
          application_id: validated_data.application_id,
        },
        {
          $set: {
            "payment.emi_due_date": validated_data.new_emi_due_date,
            /**
             * admin edit emi due date will reset the reminder,
             * admin MUST inform the customer to re-apply the due date reminder.
             */
            "payment.reminder": 0,
          },
        }
      );
    console.log(updated_loan_application, 3344);

    res.send({
      status: "ok",
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

exports.AssignPenalty = async (req, res) => {
  try {
    const validated_data = await Joi.validate(
      req.body,
      LoanManagementValidator.AssignPenalty
    );
    console.log(validated_data, 111);
    const loan_application = await LoanApplicationModel.findOne({
      application_id: validated_data.application_id,
    });
    const penalty_fee =
      loan_application.payment.penalty_fee + validated_data.penalty_fee;
    const payment_delay = loan_application.payment.payment_delay + 1;
    const update_loan_application = await LoanApplicationModel.findOneAndUpdate(
      {
        application_id: validated_data.application_id,
      },
      {
        $set: {
          "payment.penalty_fee": penalty_fee,
          "payment.payment_delay": payment_delay,
        },
      }
    );
    if (payment_delay >= 3) {
      const assign_defaulter = await UserModel.findOneAndUpdate(
        {
          account_number: loan_application.customer_id,
        },
        {
          $set: {
            defaulter: true,
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
exports.GetPaymentDetails = async (req, res) => {
  try {
    const validated_data = await Joi.validate(
      req.query,
      LoanManagementValidator.GetPaymentDetails
    );
    const payment_details = await LoanApplicationModel.aggregate([
      {
        $match: {
          application_id: validated_data.application_id,
        },
      },
      {
        $project: {
          payment: 1,
          basic_information: 1,
        },
      },
    ]);
    console.log(payment_details, 1244);
    res.send({
      status: "ok",
      data: payment_details,
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
