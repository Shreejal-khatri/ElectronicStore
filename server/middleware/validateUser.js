const { body, validationResult } = require("express-validator");

//Signup validation
const validateSignup = [
  body("firstName")
    .isString().withMessage("First name must be a string")
    .isLength({ min: 2 }).withMessage("First name must be at least 2 characters"),
  body("lastName")
    .isString().withMessage("Last name must be a string")
    .isLength({ min: 2 }).withMessage("Last name must be at least 2 characters"),
  body("email")
    .isEmail().withMessage("Must be a valid email address"),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

//Login validation
const validateLogin = [
  body("email").isEmail().withMessage("Must be a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

module.exports = { validateSignup, validateLogin };
