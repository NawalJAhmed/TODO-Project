const express = require("express");
const { Op } = require("sequelize");

const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");
const { requireAuth } = require("../auth");

const router = express.Router();
router.use(requireAuth);

//post route for adding a new task
router.post(
  "/:id/:groupId",
  asyncHandler(async (req, res) => {
    let owner_id = parseInt(req.params.id, 10);
    let memberId = req.body.assignTo;
    const groupId = parseInt(req.params.groupId, 10);
    const { name, due_date } = req.body;
    const group_id = groupId;
    if (memberId === undefined) {
      memberId = owner_id;
    }
    db.Task.create({
      name,
      group_id,
      owner_id: memberId,
      due_date,
      completed: false,
    });
    res.redirect(req.originalUrl);
  })
);

//router for when you click on a task link
router.get(
  ["/:id/:groupId/:taskId", "/:id/:groupId/:taskId/taskview"],
  csrfProtection,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const groupId = parseInt(req.params.groupId, 10);
    const taskId = parseInt(req.params.taskId, 10);
    const taskNameObject = await db.Task.findByPk(taskId);
    const taskName = taskNameObject.dataValues.name;
    const taskDueDate = taskNameObject.dataValues.due_date;
    const taskOwnerId = taskNameObject.dataValues.owner_id;
    // const taskCompleteStatus = taskNameObject.dataValues.completed;

    const members = await db.Group.findByPk(groupId, {
      include: { model: db.User, as: "groupToMember" },
    });

    let currentMemberIds = [];
    const getIds = (members) => {
      for (let i = 0; i < members.groupToMember.length; i++) {
        currentMemberIds.push(members.groupToMember[i].dataValues.id);
      }
    };
    getIds(members);

    const ownerId = members.dataValues.owner_id;
    const ownerName = await db.User.findByPk(ownerId);
    const userName = await db.User.findByPk(userId);
    const isOwner = userId === ownerId;

    const users = await db.User.findAll({
      include: { model: db.Group, as: "userToMember" },
      where: {
        id: {
          [Op.notIn]: currentMemberIds,
          [Op.ne]: ownerId,
        },
      },
    });

    const groups = await db.User.findByPk(userId, {
      include: { model: db.Group, as: "userToMember" },
    });

    const ownerGroups = await db.Group.findAll({
      where: {
        [Op.and]: [{ owner_id: userId }, { dashboard: false }],
      },
    });
    const dashboard = await db.Group.findOne({
      where: {
        [Op.and]: [{ owner_id: userId }, { dashboard: true }],
      },
    });

    //querying from members and using userId
    //or user.findbypk include group
    const groupNameObject = await db.Group.findOne({
      attributes: ["name"],
      where: { id: groupId },
    });
    const groupName = groupNameObject.dataValues.name;
    const group_id = parseInt(req.params.groupId, 10);
    const isDashboard = dashboard.id === groupId;
    //const group_id = 1
    let completed = req.url.includes("completed") ? true : false;
    let tasks;

    if (isDashboard) {
      tasks = await db.Task.findAll({
        where: {
          [Op.and]: [{ owner_id: userId }, { completed }],
        },
        order: [
          ["due_date", "ASC"],
          ["id", "ASC"],
        ],
      });
    } else {
      tasks = await db.Task.findAll({
        where: {
          [Op.and]: [{ group_id }, { completed }],
        },
        order: [
          ["due_date", "ASC"],
          ["id", "ASC"],
        ],
      });
    }
    if (req.url.endsWith("taskList")) {
      return res.render("taskList", {
        tasks,
        userId,
        groupId,
        csrfToken: req.csrfToken(),
      });
    }

    const taskOwnerNameObj = await db.User.findByPk(taskOwnerId);
    const taskOwnerName = taskOwnerNameObj.dataValues.username;

    const Subtasks = await db.SubTask.findAll({
      where: { task_id: taskId },
    });

    if (req.url.endsWith("taskview")) {
      return res.render("tasks", {
        isDashboard,
        ownerName,
        isOwner,
        taskName,
        taskId,
        users,
        members,
        taskDueDate,
        groupId,
        groups,
        ownerGroups,
        tasks,
        userId,
        groupName,
        Subtasks,
        taskOwnerId,
        ownerId,
        group_id,
        dashboard: dashboard.id,
        userName: userName.username,
        csrfToken: req.csrfToken(),
      });
    }
    res.render("taskDetails", {
      isDashboard,
      ownerName,
      isOwner,
      taskName,
      taskId,
      users,
      members,
      taskDueDate,
      groupId,
      groups,
      ownerGroups,
      tasks,
      userId,
      groupName,
      Subtasks,
      taskOwnerId,
      ownerId,
      group_id,
      dashboard: dashboard.id,
      userName: userName.username,
      csrfToken: req.csrfToken(),
    });
  })
);

//route for editing a task
router.post(
  "/:id/:groupId/:taskId",
  asyncHandler(async (req, res) => {
    let owner_id = req.params.id;
    let memberId = req.body.assignTo;
    const groupId = parseInt(req.params.groupId, 10);
    const group_id = parseInt(req.params.groupId, 10);
    const taskId = parseInt(req.params.taskId, 10);
    const { name, due_date } = req.body;

    if (memberId === undefined) {
      memberId = owner_id;
    }

    await db.Task.upsert({
      id: taskId,
      name,
      group_id,
      owner_id: memberId,
      due_date,
      completed: false,
    });

    res.redirect(req.originalUrl);
  })
);

router.post(
  "/:id/:groupId/:taskId/delete",
  asyncHandler(async (req, res) => {
    const newtaskId = req.params.taskId;
    const task_id = parseInt(req.params.taskId);
    const owner_id = req.session.auth.userId;
    const task = await db.Task.findByPk(task_id);
    const subTasks = await db.SubTask.findAll({
      where: { task_id },
    });

    if (owner_id !== task.owner_id) {
      const err = new Error("Unauthorized");
      err.status = 401;
      err.message = "You are not authorized to delete this task.";
      err.title = "Unauthorized";
      throw err;
    }
    if (task) {
      if (subTasks.length) {
        for (const subTask of subTasks) {
          await subTask.destroy();
        }
      }
      await task.destroy();
    }
    res.redirect("back");
  })
);

router.post(
  "/:id/:groupId/:taskId/completed",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const taskId = parseInt(req.params.taskId, 10);
    const task = await db.Task.findByPk(taskId);
    //res.render('tasks')
    if (task.completed === false) {
      await db.Task.update({ completed: true }, { where: { id: taskId } });
    } else {
      await db.Task.update({ completed: false }, { where: { id: taskId } });
    }
    console.log(req.url);
    res.redirect("back");
  })
);

module.exports = router;
