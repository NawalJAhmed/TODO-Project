const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");
const { loginUser, logoutUser } = require("../auth");

const router = express.Router();

router.get("/signup", csrfProtection, (req, res) => {
  const user = db.User.build();
  res.render("signup", {
    title: "signup",
    user,
    csrfToken: req.csrfToken(),
  });
});

const userValidators = [
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a username")
    .isLength({ max: 15 })
    .withMessage("username most be less than 15 characters"),
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Please provide an Email Address")
    .isLength({ max: 250 })
    .withMessage("Email Address must be less than 250 characters long")
    .isEmail()
    .withMessage("Email Address is not a valid email")
    .custom((value) => {
      return db.User.findOne({ where: { email: value } }).then((user) => {
        if (user) {
          return Promise.reject(
            "The provided Email Address is already in use by another account"
          );
        }
      });
    }),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("please provide a password")
    .isLength({ max: 50 })
    .withMessage("Password must not be more than 50 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, "g")
    .withMessage(
      'Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'
    ),
  check("confirmPassword")
    .exists({ checkFalsy: true })
    .withMessage("please confirm your password")
    .isLength({ max: 50 })
    .withMessage("Confirm Password must not be more than 50 characters long")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm Password does not match Password");
      }
      return true;
    }),
];

router.post(
  "/signup",
  csrfProtection,
  userValidators,
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const user = db.User.build({
      username,
      email,
    });

    const validatorErrors = validationResult(req);
    console.log(username);
    if (validatorErrors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.hashed_password = hashedPassword;
      await user.save();
      loginUser(req, res, user);
      res.redirect(`/users/dashboard`);
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("signup", {
        title: "signup",
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

router.get("/login", csrfProtection, (req, res) => {
  const user = db.User.build();
  res.render("login", {
    title: "login",
    user,
    csrfToken: req.csrfToken(),
  });
});

const loginValidators = [
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a Email Address"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a Password"),
];

module.exports = router;
