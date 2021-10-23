const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");
const { requireAuth } = require("../auth");

const router = express.Router();
router.use(requireAuth);

// adding a subtask
router.post(
  "/:id/:groupId/:taskId/addSubTask",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const task_id = parseInt(req.params.taskId, 10);
    await db.SubTask.create({ name, task_id });
    res.redirect("back");
  })
);

//deleting a subtask
router.post(
  "/:id/:groupId/:taskId/:subTaskId/delete",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const subTaskId = req.params.subTaskId;
    console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
    const subTask = await db.SubTask.findByPk(subTaskId);
    if (subTask) {
      await subTask.destroy();
    }
    res.redirect("back");
  })
);
module.exports = router;
