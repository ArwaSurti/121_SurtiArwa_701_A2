const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

const app = express();

// Set view engine
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("uploads")); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
app.get("/", (req, res) => {
  res.render("register", { errors: [], old: {} });
});

app.post(
  "/register",
  upload.fields([{ name: "profilePic", maxCount: 1 }, { name: "otherPics" }]),
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Enter valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    body("gender").notEmpty().withMessage("Select gender"),
    body("hobbies").notEmpty().withMessage("Select at least one hobby")
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Validation failed → re-render form with old values
      return res.render("register", { errors: errors.array(), old: req.body });
    }

    // Collect data
    const userData = {
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      hobbies: Array.isArray(req.body.hobbies) ? req.body.hobbies.join(", ") : req.body.hobbies,
      profilePic: req.files["profilePic"] ? req.files["profilePic"][0].filename : null,
      otherPics: req.files["otherPics"] ? req.files["otherPics"].map(f => f.filename) : []
    };

    // Save to file for download
    const filePath = path.join(__dirname, "uploads", `${userData.username}.json`);
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));

    res.render("success", { user: userData });
  }
);

// File download route
app.get("/download/:username", (req, res) => {
  const filePath = path.join(__dirname, "uploads", `${req.params.username}.json`);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send("File not found");
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
