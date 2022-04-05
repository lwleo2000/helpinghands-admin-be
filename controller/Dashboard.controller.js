const errorHandler = require("../tools/ErrorHandler/ErrorHandler");
const DashboardValidator = require("../Validator/Dashboard.validator");
const Joi = require("@hapi/joi");
const UserModel = require("../model/User.model");
const LoanApplicationModel = require("../model/LoanApplication.model");
const { end } = require("cheerio/lib/api/traversing");

exports.GetDashboardAnalytics = async (req, res) => {
  try {
    const validated_data = await Joi.validate(
      req.query,
      DashboardValidator.GetDashboardAnalytics
    );
    console.log(validated_data, 1234);
    const start_date = validated_data.start_date;
    const end_date = validated_data.end_date;

    //1. Get total loan application
    const total_loan_application = await LoanApplicationModel.aggregate([
      {
        $match: {
          $and: [
            {
              creation_date: {
                $gte: start_date,
              },
            },
            {
              creation_date: {
                $lte: end_date,
              },
            },
          ],
        },
      },
      {
        $count: "total_loan_application",
      },
    ]).option({ readPreference: "secondaryPreferred" });
    console.log(total_loan_application, 1255);

    // 2. Get total approved loan application
    const total_loan_application_approved =
      await LoanApplicationModel.aggregate([
        {
          $match: {
            $and: [
              {
                creation_date: {
                  $gte: start_date,
                },
              },
              {
                creation_date: {
                  $lte: end_date,
                },
              },
              {
                $or: [
                  {
                    loan_status: "Approved",
                  },
                  {
                    loan_status: "Loan Disbursed",
                  },
                  {
                    loan_status: "Fully Paid",
                  },
                ],
              },
            ],
          },
        },
        {
          $count: "total_loan_application_approved",
        },
      ]).option({ readPreference: "secondaryPreferred" });
    console.log(total_loan_application_approved, 777);

    //3. Get total Loan Disbursed, Total Repayment
    const currency_stats = await LoanApplicationModel.aggregate([
      {
        $match: {
          $and: [
            {
              creation_date: {
                $gte: start_date,
              },
            },
            {
              creation_date: {
                $lte: end_date,
              },
            },
            {
              $or: [
                {
                  loan_status: "Loan Disbursed",
                },
                {
                  loan_status: "Fully Paid",
                },
              ],
            },
          ],
        },
      },
      {
        $group: {
          _id: { start_date: start_date, end_date: end_date },
          total_loan_disbursed: { $sum: "$emi_plan.loan_amount" },
          total_repayment: { $sum: "$payment.total_repayment" },
        },
      },
    ]).option({ readPreference: "secondaryPreferred" });
    console.log(currency_stats, 888);

    //4. Get loan status count (display in bar graph)
    const loan_status_count = await LoanApplicationModel.aggregate([
      {
        $match: {
          $and: [
            {
              creation_date: {
                $gte: start_date,
              },
            },
            {
              creation_date: {
                $lte: end_date,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: { loan_status: "$loan_status" },
          count: { $sum: 1 },
        },
      },
    ]).option({ readPreference: "secondaryPreferred" });
    console.log(loan_status_count, 678);

    //5. Get loan default count (display in pie chart)
    const loan_default_count = await LoanApplicationModel.aggregate([
      {
        $match: {
          $and: [
            {
              creation_date: {
                $gte: start_date,
              },
            },
            {
              creation_date: {
                $lte: end_date,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: { loan_default: "$loan_default" },
          count: { $sum: 1 },
        },
      },
    ]).option({ readPreference: "secondaryPreferred" });
    console.log(loan_default_count, 3344);

    const processed_loan_status_count = [];

    if (loan_status_count[0] !== undefined) {
      //1. Process loan status count
      loan_status_count.forEach((loan_status, index) => {
        processed_loan_status_count.push({
          loan_status: loan_status._id.loan_status,
          count: loan_status.count,
        });
      });
    }

    const processed_loan_default_count = [];

    if (loan_default_count[0] !== undefined) {
      //2. Process loan default count
      loan_default_count.forEach((loan_default, index) => {
        const result = calculatePercentage(
          loan_default_count,
          loan_default._id.loan_default
        );
        processed_loan_default_count.push({
          loan_default: loan_default._id.loan_default,
          count: loan_default.count,
          percentage: result,
        });
      });
    }
    console.log(processed_loan_default_count, 8528);
    const analytic_results = {
      total_loan_application: total_loan_application[0]
        ? total_loan_application[0].total_loan_application
        : 0,
      total_loan_application_approved: total_loan_application_approved[0]
        ? total_loan_application_approved[0].total_loan_application_approved
        : 0,
      total_loan_disbursed: currency_stats[0]
        ? parseFloat(currency_stats[0].total_loan_disbursed).toFixed(2)
        : 0,
      total_repayment: currency_stats[0]
        ? parseFloat(currency_stats[0].total_repayment).toFixed(2)
        : 0,
      loan_status_count: processed_loan_status_count,
      loan_default_count: processed_loan_default_count,
    };
    res.send({
      status: "ok",
      data: {
        analytic_results,
      },
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

const calculatePercentage = (datasets, default_status) => {
  if (datasets.length === 1) {
    return 100;
  }

  if (datasets.length > 1) {
    var sum = 0;
    var value = 0;

    for (let i = 0; i < datasets.length; i++) {
      const data = datasets[i];
      sum += data.count;
    }
    var obj = datasets.find((obj) => obj._id.loan_default === default_status);
    console.log(obj, 11);
    value = obj.count;

    return to2dp((value / sum) * 100);
  }
};

const to2dp = (num) => {
  const precision = 2;
  return parseFloat(
    (+(Math.round(+(num + "e" + precision)) + "e" + -precision)).toFixed(
      precision
    )
  );
};
