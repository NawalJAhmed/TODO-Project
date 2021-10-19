const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");
const { requireAuth } = require("../auth");

const router = express.Router();

router.post(
  "/add",
  requireAuth,
  csrfProtection,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const taskId = parseInt(req.params.taskID, 10);
    db.SubTask.create({ name, task_id: taskId });
    res.send("happy");
  })
);
