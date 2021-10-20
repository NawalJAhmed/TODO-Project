const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");
const { loginUser, logoutUser } = require("../auth");
const { Op } = require("sequelize");

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
    if (validatorErrors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.hashed_password = hashedPassword;
      await user.save();
      loginUser(req, res, user);

      const owner_id = req.session.auth.userId;
      let dashboard = await db.Group.create({
        name: "dashboard",
        owner_id,
        dashboard: true,
      });
      let url = `/users/${owner_id}/${dashboard.id}`;
      res.redirect(url);
    } else {
      const errors = validatorErrors.array();
      const usernameError = errors.find((error) => error.param === "username");
      const emailError = errors.find((error) => error.param === "email");
      const passwordError = errors.find((error) => error.param === "password");
      const comfirmPasswordError = errors.find(
        (error) => error.param === "confirmPassword"
      );
      const data = req.body;

      res.render("signup", {
        title: "signup",
        user,
        usernameError,
        emailError,
        passwordError,
        comfirmPasswordError,
        data,
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
    notFound: "",
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

router.post(
  "/login",
  csrfProtection,
  loginValidators,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    let errors = [];
    let notFound = "";
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const user = await db.User.findOne({ where: { email } });

      if (user !== null) {
        // If the user exists then compare their password
        // to the provided password.
        const passwordMatch = await bcrypt.compare(
          password,
          user.hashed_password.toString()
        );

        if (passwordMatch) {
          // If the password hashes match, then login the user
          // and redirect them to the users dashboard route.
          loginUser(req, res, user);

          const owner_id = req.session.auth.userId;
          let dashboard = await db.Group.findOne({
            where: {
              [Op.and]: [{ owner_id }, { dashboard: true }],
            },
          });
          let url = `/users/${owner_id}/${dashboard.id}`;
          console.log("!!!!!!!!!!!! " + url);
          return res.redirect(url);
        }
      }

      // Otherwise display an error message to the user.
      notFound = "please check your email address and password and try again";
    } else {
      errors = validatorErrors.array();
    }
    const emailError = errors.find((error) => error.param === "email");
    const passwordError = errors.find((error) => error.param === "password");
    const data = req.body;
    res.render("login", {
      title: "Login",
      email,
      emailError,
      passwordError,
      notFound,
      data,
      csrfToken: req.csrfToken(),
    });
  })
);

router.get("/logout", (req, res) => {
  logoutUser(req, res);
  res.redirect("/");
});

module.exports = router;
