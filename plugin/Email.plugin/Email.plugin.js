const nodemailer = require("nodemailer");
const passport = require("passport");

module.exports = {
  sendHTMLEmail: async (email, subject, html_message) => {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_EMAIL_PASSWORD,
      },
    });

    let info = transporter.sendMail({
      from: '"HelpingHands" <' + process.env.SMTP_EMAIL + ">",
      to: email,
      subject: subject,
      html: html_message,
    });

    return info;
  },
};
