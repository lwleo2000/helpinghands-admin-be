const app = require("express")();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const passportInit = require("./tools/Passport/Passport");
const formData = require("express-form-data");
require("dotenv").config();

const options = {
  maxFieldsSize: process.env.MAX_FIELDS_SIZE,
  maxFilesSize: process.env.MAX_FILE_UPLOAD_SIZE,
};
//Router
const DashboardRouter = require("./router/Dashboard.router");
const UserManagementRouter = require("./router/UserManagement.router");
const AuthRouter = require("./router/Auth.router");
const LoanApplicationRouter = require("./router/LoanApplication.router");
const LoanPlanRouter = require("./router/LoanPlan.router");
const LoanManagementRouter = require("./router/LoanManagement.router");


//===============EXPRESS================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(formData.parse(options));
app.disable("x-powered-by");

// ===============PASSPORT===============
passportInit();
app.use(passport.initialize());

//Init MongoDB
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    readPreference: "secondaryPreferred",
  })
  .catch((err) => {
    console.log(err, 1243);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to DB, Cluster Mode 3 Node");
  console.log("--------------Init Done--------------");
});

//Path
app.use("/auth", AuthRouter);
app.use("/dashboard", DashboardRouter);
app.use("/loan-application", LoanApplicationRouter);
app.use("/user-management", UserManagementRouter);
app.use("/loan-plan-management", LoanPlanRouter);
app.use("/loan-management", LoanManagementRouter);
app.listen(process.env.PORT || 8001);
