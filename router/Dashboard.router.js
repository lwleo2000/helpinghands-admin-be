const express = require("express");
const router = express.Router();
const Controller = require("../controller/Dashboard.controller");
const isAdmin = require("../middleware/isAdmin");

router.get(
  "/get-dashboard-analytics",
  isAdmin,
  Controller.GetDashboardAnalytics
);

module.exports = router;
