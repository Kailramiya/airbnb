const { check ,validationResult } = require("express-validator");
const Home = require("../models/home");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const user = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      email: "",
    },
    user:{}
  });

};

exports.postLogin = async (req, res, next) => {
  const {email ,password}= req.body;
  const user = await User.findOne({  email })
    
      if (!user) {
        return res.status(401).render("auth/login", {
          pageTitle: "Login",
          currentPage: "login",
          isLoggedIn: false,
          errors: ["User does not exist."],
          oldInput: {
            email: email,
          },
          user: {} // Use session user or empty object,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).render("auth/login", {
          pageTitle: "Login",
          currentPage: "login",
          isLoggedIn: false,
          errors: ["Invalid password."],
          oldInput: {
            email: email,
          },
          user: {}
        });
      }
      req.session.user = user; // Store user in session
      req.session.isLoggedIn = true; // Set isLoggedIn to true
      res.redirect("/"); // Redirect to home page
    
      await req.session.save();
  
};
exports.postLogout = (req, res, next) => {
  // req.session.isLoggedIn = false;
  req.session.destroy((err) => {
    if (err) {
      console.errors("Errors destroying session:", err);
      return res.redirect("/"); // Redirect to home page on errors
    }
  }); 
  res.redirect("/");
};


exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "",
    },
    user: {}
  });
};
exports.postSignup = [
  check ("firstName")
  .notEmpty()
  .withMessage("First name is required")
  .trim()
  .isLength({ min: 3 })
  .withMessage("First name must be at least 3 characters long")
  .matches(/^[a-zA-Z]+$/)
  .withMessage("First name must contain only letters"),

  check ("lastName")
  .matches(/^[a-zA-Z]+$/)
  .withMessage("Last name must contain only letters"),

  check("email")
  .isEmail()
  .withMessage("Please enter a valid email address")
  .normalizeEmail(),

  check("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/)
  .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

  check("confirmPassword")
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Errors("Passwords do not match");
    }
    return true;
  })
  .withMessage("Passwords do not match")
  .trim(),

  check("userType")
  .notEmpty()
  .withMessage("User type is required")
  .isIn(["guest", "host"])
  .withMessage("User type must be either Guest or Host"),

  check("termsAccepted")
  .notEmpty()
  .withMessage("You a must accept the terms and conditions")
  .custom((value, { req }) => {
    if (value !== "on") {
      throw new Error("You must accept the terms and conditions");
    }
    return true;
  }),

  
  (req, res, next) => {
  const { firstName, lastName, email, password, userType } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      pageTitle: "Signup",
      currentPage: "signup",
      isLoggedIn: false,
      errors : errors.array().map(err => err.msg),
      oldInput: {
        firstName,
        lastName,
        email,
        userType,
      },
      user: {},
    });
  }

  bcrypt.hash(password, 12)
  .then(hashedPassword => {
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Hash the password before saving
      userType,
    });
    return user.save();
  })
  .then(() => {
    console.log("User created successfully");
    res.redirect("/login");
  })
  .catch(err => {
    console.error("Error creating user:", err);
    return res.status(500).render("auth/signup", {
      pageTitle: "Signup",
      currentPage: "signup",
      isLoggedIn: false,
      errors: ["An error occurred while creating the user. Please try again."],
      oldInput: {
        firstName,
        lastName,
        email,
        userType,
      },
      user: {},
    });
  });


  // Here you would typically save the user to the database
  // For now, we just redirect to the login page
  // res.redirect("/login");
}];

