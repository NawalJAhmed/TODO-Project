
const express = require('express');
const db = require("../db/models");
const { Group, Task } = db;
const { csrfProtection, asyncHandler } = require('./utils');
const { requireAuth } = require("../auth");
const { check, validationResult } = require('express-validator');
const router = express.Router();

// router.use(requireAuth);

router.get(
    "/",
    csrfProtection,
    asyncHandler(async (req, res) => {
      const tasks = await Task.findAll({
      })
      res.json({tasks, csrfToken: req.csrfToken()})
    })
  );

// const validateTask = [
// check("name")
//     .exists({ checkFalsy: true })
//     .withMessage("Task can't be empty."),
// check("name")
//     .isLength({ max: 100 })
//     .withMessage("Task can't be longer than 100 characters."),
// validationResult,
// ];

router.post(
    "/",
    // validateTask,
    // csrfProtection,
    asyncHandler(async (req, res) => {
      const { name, due_date } = req.body;
      const task = await Task.create({
          name: 'this is a post test task',
          group_id: 1,
          owner_id: 2,
          due_date: "2022-01-01",
          completed: false,
        });
      res.json({ task });
    })
  );



module.exports = router;
