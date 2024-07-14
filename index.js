import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected...")
})

const app = express();
const port = 3000;

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
})


app.get("/create-account", (req, res) => {
  res.render('sign-in.ejs');
})

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  res.send("Logged")
})

app.post("/create-account", (req, res) => {
  const { username, email, password, confirmation } = req.body;
  console.log("Successful");
  res.send("Account Created")
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});