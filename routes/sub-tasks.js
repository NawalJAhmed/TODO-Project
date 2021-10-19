const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");
const { requireAuth } = require("../auth");

const router = express.Router();
router.use(requireAuth);

router.post(
  "/:taskID/add",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const task_id = parseInt(req.params.taskID, 10);
    db.SubTask.create({ name, task_id });
    res.send("added");
  })
);

router.delete(
  "/:taskID/:subTaskID",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const subTaskId = req.params.subTaskID;
    const subTask = await db.SubTask.findByPk(subTaskId);
    if (subTask) {
      await subTask.destroy();
      res.send("deleted");
    }
    res.send("subtask not found");
  })
);
module.exports = router;
