const mongoose = require("mongoose");

const ReminderScehema = mongoose.Schema({
  creation_date: Date,
  application_id: String,
  emi_due_date: Date,
  reminder_dates: [
    {
      reminder_date: Date,
    },
  ],
});

module.exports = mongoose.model("reminder", ReminderScehema, "reminder");
