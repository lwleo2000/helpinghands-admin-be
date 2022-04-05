const mongoose = require("mongoose");

const DeviceScehema = mongoose.Schema({
  creation_date: Date,
  account_number: String,
  device_name: String,
  device_manifacturer: String,
  device_brand: String,
  device_model: String,
  device_id: String,
  device_uuid: String,
  is_tablet: Boolean,
  app_version: String,
  sys_version: String,
  notification_token: String,
});

module.exports = mongoose.model("device", DeviceScehema, "device");
