const mongoose = require("mongoose");

const loanPlanSchema = mongoose.Schema({
  loan_plan_id: String,
  title: String,
  max_loan: Number,
  annual_interest_rate: Number,
});

const emiPlanSchema = mongoose.Schema({
  loan_amount: Number,
  loan_term: Number,
  loan_emi: Number,
  total_interest: Number,
  loan_reason: String,
});

const basicInformationSchema = mongoose.Schema({
  name: String,
  birth_date: String,
  ic_number: String,
  gender: String,
  race: String,
  martial_status: String,
  educational_level: String,
  home_ownership: String,
  address_line_1: String,
  address_line_2: String,
  city: String,
  post_code: String,
  state: String,
  email: String,
  phone_number: String,
});

const socialInformationSchema = mongoose.Schema({
  company_name: String,
  employment_status: String,
  position: String,
  office_address: String,
  company_phone_number: String,
  annual_income: Number,
  employment_length: Number,
  dependant_name_1: String,
  dependant_relationship_1: String,
  dependant_phone_number_1: String,
  dependant_name_2: String,
  dependant_relationship_2: String,
  dependant_phone_number_2: String,
});

const bankInformationSchema = mongoose.Schema({
  bank: String,
  bank_account_number: String,
  bank_account_name: String,
});

const identityPhotoSchema = mongoose.Schema({
  front_NRIC_photo: Object,
  back_NRIC_photo: Object,
  face_photo: Object,
});

const paymentSchema = mongoose.Schema({
  total_repayment: Number,
  emi_paid: Number,
  emi_due_date: Date,
  reminder: Number,
  penalty_fee: {
    type: Number,
    default: undefined,
  },
  payment_delay: {
    type: Number,
    default: undefined,
  },
  payment_history_log: {
    type: Array,
    default: undefined,
  },
});

const LoanApplicationScehema = mongoose.Schema({
  creation_date: Date,
  application_id: String,
  customer_id: String,
  loan_plan: loanPlanSchema,
  emi_plan: emiPlanSchema,
  basic_information: basicInformationSchema,
  social_information: socialInformationSchema,
  bank_information: bankInformationSchema,
  identity_photo: identityPhotoSchema,
  loan_default: {
    type: String,
    default: undefined,
  },
  loan_status: String,
  payment: paymentSchema,
  admin_remarks: {
    type: String,
    default: undefined,
  },
  loan_agreement: {
    agree: Boolean,
    submission_date: Date,
    signature: {
      type: Array,
      default: undefined,
    },
  },
});

module.exports = mongoose.model(
  "loan_application",
  LoanApplicationScehema,
  "loan_application"
);
