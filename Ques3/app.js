const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const Redis = require("ioredis");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;


const redisClient = new RedisStore({
  host: "127.0.0.1",
  port: 6379
});


app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "adfghjk345678",  
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60000 }
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  if (req.session.username) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Dummy authentication
  if (username === "admin" && password === "1234") {
    req.session.username = username;
    return res.redirect("/dashboard");
  }
  res.render("login", { error: "Invalid credentials" });
});

app.get("/dashboard", (req, res) => {
  if (!req.session.username) {
    return res.redirect("/login");
  }
  res.render("dashboard", { username: req.session.username });
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect("/login");
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
 