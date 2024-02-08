require("dotenv").config();
const nodemailer = require("nodemailer");

const { SENDER_EMAIL, SENDER_PASSWORD } = process.env;

const transport = nodemailer.createTransport({
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (msg) => {
  const email = { ...msg, from: SENDER_EMAIL };
  await transport.sendMail(email);
  return true;
};

module.exports = sendEmail;
