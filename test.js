import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { fileURLToPath } from "url";
import path from "path";
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

// Setup a transporter to send emails

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_GMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

// Configuring transporter to send template emails
const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.resolve(__dirname, 'views'),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, 'views'),
  extName: ".hbs",
}

transporter.use("compile", hbs(handlebarOptions))

const mailOptions = {
  from: process.env.GMAIL_GMAIL,
  to: "aleywin48@gmail.com",
  subject: "Verify your Test AI account",
  template: 'confirmation',
  context: {
    name: "Edy",
    authKey: "Test"
  }
}

await transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error(error);
  } else {
    console.log(info.response)
  }
})