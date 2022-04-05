const express = require("express");
const router = express.Router();
const Controller = require("../controller/LoanManagement.controller");
const isAdmin = require("../middleware/isAdmin");

router.post("/complete-payment", isAdmin, Controller.CompletePayment);
router.post("/edit-emi-due-date", isAdmin, Controller.EditEMIDueDate);
router.post("/assign-penalty", isAdmin, Controller.AssignPenalty);
router.get("/get-payment-details", isAdmin, Controller.GetPaymentDetails);
module.exports = router;
