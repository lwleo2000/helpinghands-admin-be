const express = require("express");
const router = express.Router();
const Controller = require("../controller/UserManagement.controller");
const isAdmin = require("../middleware/isAdmin");
const isSuperAdmin = require("../middleware/isSuperAdmin");

router.post(
  "/register-admin-account",
  isAdmin,
  Controller.RegisterAdminAccount
);
router.get("/get-admin-list", isAdmin, Controller.GetAdminList);
router.get("/get-user-list", isAdmin, Controller.GetUserList);
router.post("/ban-admin-account", isSuperAdmin, Controller.BanAdminAccount);
router.post("/ban-user-account", isAdmin, Controller.BanUserAccount);
router.post("/unset-defaulter", isAdmin, Controller.UnsetDefaulter);
module.exports = router;
