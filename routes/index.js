var express = require("express");
var router = express.Router();
const { csrfProtection, asyncHandler } = require("./utils");

/* GET home page. */
router.get("/", csrfProtection, function (req, res, next) {
  res.render("index", {
    demoEmail: "demo@test.com",
    demoPwd: "Demouser1!",
    csrfToken: req.csrfToken(),
  });
});

module.exports = router;
