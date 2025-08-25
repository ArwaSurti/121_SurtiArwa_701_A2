const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    store: new FileStore({}),
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
  })
);


const USER = { username: "admin", password: "12345" };

// Routes
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/succes");
  } else {
    res.redirect("/login");
  }
});

// Login Page
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// Handle Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    return res.redirect("/succes");
  }

  res.render("login", { error: "Invalid username or password!" });
});

// Welcome Page
app.get("/succes", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("succes", { user: req.session.user });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
