const LoanApplicationModel = require("../../model/LoanApplication.model");
const LoanApplicationValidator = require("../../Validator/LoanApplication.validator");
const errorHandler = require("../../tools/ErrorHandler/ErrorHandler");
const FirebaseCloudMessagingPlugin = require("../../plugin/FirebaseCloudMessaging.plugin");
const EmailPlugin = require("../../plugin/Email.plugin/Email.plugin");
const fs = require("fs");
const cheerio = require("cheerio");
const Joi = require("@hapi/joi");
const moment = require("moment");

exports.GetLoanApplication = async (req, res) => {
  try {
    const loan_application = await LoanApplicationModel.aggregate([
      {
        $match: {
          loan_status: { $in: ["Under Approval", "Approved"] },
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "customer_id",
          foreignField: "account_number",
          as: "user_details",
        },
      },
      {
        $unwind: {
          path: "$user_details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          creation_date: -1,
        },
      },
    ]).allowDiskUse(true);
    console.log(loan_application, 777);
    res.send({
      status: "ok",
      data: loan_application,
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

exports.GetLoanApplicationList = async (req, res) => {
  try {
    const loan_application_list = await LoanApplicationModel.aggregate([
      {
        $match: {
          loan_status: {
            $in: [
              "Under Approval",
              "Approved",
              "Rejected",
              "Suspended",
              "Loan Disbursed",
              "Fully Paid",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "customer_id",
          foreignField: "account_number",
          as: "user_details",
        },
      },
      {
        $unwind: {
          path: "$user_details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          creation_date: -1,
        },
      },
    ]).allowDiskUse(true);
    console.log(loan_application_list, 777);
    res.send({
      status: "ok",
      data: loan_application_list,
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

exports.GetLoanApplicationForm = async (req, res) => {
  try {
    const validated_data = await Joi.validate(
      req.query,
      LoanApplicationValidator.GetLoanApplicationForm
    );
    const loan_application_form = await LoanApplicationModel.aggregate([
      {
        $match: {
          application_id: validated_data.application_id,
        },
      },
    ]).allowDiskUse(true);
    console.log(loan_application_form, 666);
    res.send({
      status: "ok",
      data: loan_application_form,
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

exports.VerifyLoanApplication = async (req, res) => {
  try {
    const validated_data = await Joi.validate(
      req.body,
      LoanApplicationValidator.VerifyLoanApplication
    );
    const application_id = validated_data.application_id;
    const customer_id = validated_data.customer_id;
    const loan_amount = validated_data.loan_amount;
    const loan_term = validated_data.loan_term;
    const loan_emi = validated_data.loan_emi;
    const total_interest = validated_data.total_interest;
    const customer_email = validated_data.email;
    const action = validated_data.action;
    const remarks = validated_data.remarks;

    console.log(validated_data, 1111);
    await LoanApplicationModel.findOneAndUpdate(
      {
        application_id: application_id,
      },
      {
        $set: {
          loan_status: action,
          admin_remarks: remarks,
        },
      }
    );

    if (action === "Approved") {
      var loan_approval_html = fs.readFileSync(
        "./controller/LoanApplication.controller/loanApproval.html"
      );
      const $ = cheerio.load(loan_approval_html.toString());
      $("#application_id").replaceWith(
        `<b>Application Number&nbsp; &nbsp; :</b> ${application_id}`
      );

      $("#customer_id").replaceWith(
        `<b>Customer Number&nbsp; &nbsp; :</b> ${customer_id}`
      );

      $("#loan_amount").replaceWith(
        `<b>Loan Amount&nbsp; &nbsp; :</b> RM${parseFloat(loan_amount).toFixed(
          2
        )}`
      );

      $("#loan_term").replaceWith(
        `<b>Loan Term&nbsp; &nbsp; :</b> ${loan_term} month(s)`
      );

      $("#loan_emi").replaceWith(
        `<b>Loan EMI&nbsp; &nbsp; :</b> RM${parseFloat(loan_emi).toFixed(2)}`
      );

      $("#total_interest").replaceWith(
        `<b>Total Interest&nbsp; &nbsp; :</b> RM${parseFloat(
          total_interest
        ).toFixed(2)}`
      );
      const processed_loan_approval_html = $.html();
      await EmailPlugin.sendHTMLEmail(
        customer_email,
        "Loan Approval Application Number #" + application_id,
        processed_loan_approval_html
      );
    }

    if (action === "Loan Disbursed") {
      const current_date = new Date();
      const current_month = current_date.getMonth();
      current_date.setMonth(current_month + 1);
      const emi_due_date = current_date;
      await LoanApplicationModel.findOneAndUpdate(
        {
          application_id: application_id,
        },
        {
          $set: {
            "payment.emi_due_date": emi_due_date,
          },
        }
      );

      var loan_disbursed_html = fs.readFileSync(
        "./controller/LoanApplication.controller/loanDisbursed.html"
      );
      const $ = cheerio.load(loan_disbursed_html.toString());
      $("#application_id").replaceWith(
        `<b>Application Number&nbsp; &nbsp; :</b> ${application_id}`
      );

      $("#customer_id").replaceWith(
        `<b>Customer Number&nbsp; &nbsp; :</b> ${customer_id}`
      );

      $("#loan_amount").replaceWith(
        `<b>Loan Amount&nbsp; &nbsp; :</b> RM${parseFloat(loan_amount).toFixed(
          2
        )}`
      );

      $("#loan_term").replaceWith(
        `<b>Loan Term&nbsp; &nbsp; :</b> ${loan_term} month(s)`
      );

      $("#loan_emi").replaceWith(
        `<b>Loan EMI&nbsp; &nbsp; :</b> RM${parseFloat(loan_emi).toFixed(2)}`
      );

      $("#total_interest").replaceWith(
        `<b>Total Interest&nbsp; &nbsp; :</b> RM${parseFloat(
          total_interest
        ).toFixed(2)}`
      );

      $("#emi_due_date").replaceWith(
        `<b style="color: #61acf1">${moment(emi_due_date).format(
          "YYYY-MM-DD"
        )}.`
      );
      const processed_loan_approval_html = $.html();
      await EmailPlugin.sendHTMLEmail(
        customer_email,
        "Loan Approval Application Number #" + application_id,
        processed_loan_approval_html
      );
    }

    await FirebaseCloudMessagingPlugin.SendPushNotification(
      customer_id,
      `Loan Application #${validated_data.application_id}`,
      `Your loan application is now under the status of ${validated_data.action}`
    );
    res.send({
      status: "ok",
    });
  } catch (error) {
    console.log(error);
    errorHandler(req, res, error);
  }
};

exports.GetActiveLoan = async (req, res) => {
  try {
    const active_loan = await LoanApplicationModel.aggregate([
      {
        $match: {
          loan_status: "Loan Disbursed",
        },
      },
    ]).allowDiskUse(true);
    console.log(active_loan, 1221);
    res.send({
      status: "ok",
      data: active_loan,
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
