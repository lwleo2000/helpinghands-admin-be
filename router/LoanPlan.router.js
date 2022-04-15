const express = require("express");
const router = express.Router();
const Controller = require("../controller/LoanPlan.controller");
const isAdmin = require("../middleware/isAdmin");

router.get("/get-loan-plan-list", Controller.GetLoanPlanList);
router.post("/create-loan-plan", isAdmin, Controller.CreateLoanPlan);
router.post("/edit-loan-plan", isAdmin, Controller.EditLoanPlan);
router.post("/loan-plan-action", isAdmin, Controller.LoanPlanAction);
module.exports = router;
