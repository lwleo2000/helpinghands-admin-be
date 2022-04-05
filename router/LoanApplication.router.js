const express = require("express");
const router = express.Router();
const Controller = require("../controller/LoanApplication.controller/LoanApplication.controller");
const isAdmin = require("../middleware/isAdmin");

router.get("/get-loan-application", isAdmin, Controller.GetLoanApplication);
router.get(
  "/get-loan-application-list",
  isAdmin,
  Controller.GetLoanApplicationList
);
router.get(
  "/get-loan-application-form",
  isAdmin,
  Controller.GetLoanApplicationForm
);
router.post(
  "/verify-loan-application",
  isAdmin,
  Controller.VerifyLoanApplication
);
router.get("/get-active-loan", isAdmin, Controller.GetActiveLoan);
module.exports = router;
