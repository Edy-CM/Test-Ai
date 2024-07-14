import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// let transporter = nodemailer.createTransport({
//   service:"gmail",
//   auth: {
//     user: process.env.GMAIL_GMAIL,
//     pass: process.env.GMAIL_PASSWORD
//   }
// });

// let mailOprtions = {
//   from: process.env.GMAIL_PASSWORD,
//   to: "aleywin48@gmail.com",
//   subject: "Test Email",
//   text: "This is a test email sent from Node.js using Nodemailer."
// };

// transporter.sendMail(mailOprtions, function(err, info) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Email sent: " + info.response);
//   }
// })
