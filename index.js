import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import bcrypt from "bcrypt";
import crypto from "crypto";
import pkg from "mysql2";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_GMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

global.emailData = {};

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
let emailData = {}

const mysql = pkg;

const connection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
}).promise();

const app = express();
const port = 3000;
let logged = false;

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  if (logged === false) {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
})


app.get("/create-account", (req, res) => {
  res.render('sign-in.ejs');
})

app.get("/confirmation", async (req, res) => {
  const key = req.query.key || false;
  const email = req.query.email || false;
  if (key) {
    try {
      const searchKey = async(key) => {
      const [results] = await connection.query("SELECT * FROM users WHERE authKey = ?", [key]);
      return results[0];
    }
    const userWithKey = await searchKey(key);
    await connection.execute("UPDATE users SET authKey = '', active = 1 WHERE id = ?", [userWithKey['id']]);
    res.redirect("/")
    } catch (err) {
      res.render('confirmation.ejs', { authKeyValid: false });
    }
  } else if (email) {
    res.render('confirmation.ejs', { email: email })
  } else {
    res.redirect('/login');
  }
})

app.get("/resend", async(req, res) => {
  if (emailData['email']) {
    const mailOptions = {
      from: process.env.GMAIL_GMAIL,
      to: emailData['email'],
      subject: "Verify your Test AI account",
      template: 'confirmationEmail',
      context: {
        name: emailData['name'],
        authKey: emailData['authKey']
      }
    }

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log(info.response)
      }
    })

    res.redirect(`/confirmation?email=${emailData['email']}`);
  } else {
    res.redirect("/create-account")
  }
})


app.post("/login", async (req, res) => {
  
  const { email, password } = req.body;
  const searchUser = async(email) => {
    const [results] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
    return results[0];
  }
  const userFound = await searchUser(email);
  if (userFound) {
    const passwordIsCorrect = await bcrypt.compare(password, userFound['password']);
    if (passwordIsCorrect) {
      res.send("Logged")
    } else {
      res.render('login.ejs', { lastEmail: email, passwordNotCorrect: true });
    }
  } else {
    res.render('login.ejs', { emailNotFound: true });
  }
})

app.post('/create-account', async (req, res) => {
  const { username, email, password } = req.body;

  const authKey = crypto.randomBytes(32).toString('hex');

  emailData['name'] = username;
  emailData['email'] = email;
  emailData['authKey'] = authKey; 

  try {
    // Hash the password
    const hash = await bcrypt.hash(password, 13);

    // Insert new user into the database
    await createUser(username, email, hash, authKey);

    // Successful insertion
    const mailOptions = {
      from: process.env.GMAIL_GMAIL,
      to: email,
      subject: "Verify your Test AI account",
      template: 'confirmationEmail',
      context: {
        name: username,
        authKey: authKey
      }
    }

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log(info.response)
      }
    })

    res.redirect(`/confirmation?email=${email}`);
  } catch (err) {
    // Handle error
    if (err && err.code === 'ER_DUP_ENTRY') {
      res.render('sign-in.ejs', { emailAlreadyExists: true });
    } else {
      console.error('Error creating user:', err);
      res.status(500).send('Internal Server Error');
    }
  }
});

// Async function to create user
async function createUser(username, email, hash, uniqueToken) {
  try {
    await connection.execute(
      'INSERT INTO users (id, username, email, password, authkey) VALUES (UUID(), ?, ?, ?, ?)',
      [username, email, hash, uniqueToken]
    );
  } catch (error) {
    throw error; // Propagate the error for proper handling in the route handler
  }
}

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});