const express = require("express");
const { check, validationResult } = require("express-validator");
const { Op } = require("sequelize");

const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");
const { requireAuth } = require("../auth");
const router = express.Router();
router.use(requireAuth);
// this route returns groups that a given user belongs to
// TODO add groups, tasks, sub-tasks

router.get(
  "/:id/:groupId",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const groupId = parseInt(req.params.groupId, 10);
    // const taskId = parseInt(req.params.taskId, 10);
    const groupTasks = await db.Task.findAll({
      where: { group_id: groupId },
      include: { model: db.SubTask },
    });

    const members = await db.Group.findByPk(groupId, {
      include: { model: db.User, as: "groupToMember" },
    });

    //console.log(members)
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

    const isDashboard = dashboard.id === groupId;
    const groupNameObject = await db.Group.findOne({
      attributes: ["name"],
      where: { id: groupId },
    });
    const groupName = groupNameObject.dataValues.name;
    const groupInfo = await db.Group.findByPk(groupId);
    const group_id = parseInt(req.params.groupId, 10);
    //const group_id = 1
    let tasks = await db.Task.findAll({
      where: { group_id },
      order: [["due_date", "ASC"]],
    });

    if (isDashboard) {
      tasks = await db.Task.findAll({
        where: { owner_id: userId },
        order: [["due_date", "ASC"]],
      });
    }

    res.render("groupInfo", {
      isDashboard,
      ownerName,
      isOwner,
      users,
      members,
      currentMemberIds,
      groups,
      ownerGroups,
      tasks,
      userId,
      groupId,
      groupName,
      dashboard: dashboard.id,
      userName: userName.username,
      csrfToken: req.csrfToken(),
    });
  })
);

const groupValidators = [
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for group name"),
];

// create group
router.post(
  "/:id/:groupId/create-group",
  csrfProtection,
  groupValidators,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const owner_id = req.session.auth.userId;

    const group = db.Group.build({
      owner_id,
      name,
      dashboard: false,
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await group.save();
      res.redirect("back");
      //res.redirect("/");
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("groups", {
        title: "Add Group",
        group,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

//add member
router.post(
  "/:id/:groupId/addMember",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const user_id = parseInt(req.body.addMember);
    const groupId = parseInt(
      JSON.stringify(req.headers.referer).split("/").slice(-1)
    );

    const member = await db.Member.create({
      user_id,
      group_id: groupId,
    });

    res.redirect("back");
  })
);

router.post(
  "/:id/:groupId/deleteGroup",
  asyncHandler(async (req, res) => {
    const groupId = parseInt(
      JSON.stringify(req.headers.referer).split("/").slice(-1)
    );

    const members = await db.Member.findAll({ where: { group_id: groupId } });
    if (members) {
      for (let i = 0; i < members.length; i++) {
        await members[i].destroy();
      }
    }
    const group = await db.Group.findByPk(groupId);
    await group.destroy();

    res.redirect("back");
  })
);


router.post(
  "/:id/:groupId/removeMember",
  asyncHandler(async (req, res) => {
    const groupId = parseInt(
      JSON.stringify(req.headers.referer).split("/").slice(-1)
    );
    const userId = parseInt(req.body.removeMember);
    const member = await db.Member.findOne({
      where: {
        [Op.and]: [{ user_id: userId }, { group_id: groupId }],
      },
    });

    await member.destroy();
    res.redirect("back");
  })
);

//post route for adding a new task
router.post(
  "/:id/:groupId",
  asyncHandler(async (req, res) => {
    let owner_id = req.params.id;
    let memberId = req.body.assignTo;
    const groupId = parseInt(req.params.groupId, 10);
    const { name, due_date } = req.body;
    // owner_id = parseInt(req.params.owner_id, 10);
    // const group_id = parseInt(req.params.groupID, 10);
    // console.log(group_id);
    const group_id = groupId;
    if (memberId === undefined) {
      //console.log({ name, group_id, owner_id: memberId, due_date, completed: false });
      memberId = owner_id;
    }
    db.Task.create({
      name,
      group_id,
      owner_id: memberId,
      due_date,
      completed: false,
    });
    // res.redirect("users/:id/:groupId")
    res.redirect(req.originalUrl);
  })
);

// show completed tasks
// refactor later
router.get(
  "/:id/:groupId/completed",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const groupId = parseInt(req.params.groupId, 10);
    // const taskId = parseInt(req.params.taskId, 10);
    const groupTasks = await db.Task.findAll({
      where: { group_id: groupId },
      include: { model: db.SubTask },
    });

    const members = await db.Group.findByPk(groupId, {
      include: { model: db.User, as: "groupToMember" },
    });

    const ownerId = members.dataValues.owner_id;
    const ownerName = await db.User.findByPk(ownerId);
    const userName = await db.User.findByPk(userId);
    const isOwner = userId === ownerId;

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
   

    const groupNameObject = await db.Group.findOne({
      attributes: ["name"],
      where: { id: groupId },
    });
    const groupName = groupNameObject.dataValues.name;
    const groupInfo = await db.Group.findByPk(groupId);
    const group_id = parseInt(req.params.groupId, 10);
    
    const tasks = await db.Task.findAll({
      where: { group_id },
      order: [["due_date", "ASC"]],
    });
    res.render("showCompletedTasks", {
      ownerName,
      isOwner,
      members,
      groups,
      ownerGroups,
      tasks,
      userId,
      groupName,
      dashboard: dashboard.id,
      userName: userName.username,
      csrfToken: req.csrfToken(),
    });
  })
);

//router for when you click on a task link
router.get(
  "/:id/:groupId/:taskId",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const groupId = parseInt(req.params.groupId, 10);
    const taskId = parseInt(req.params.taskId, 10);
    const taskNameObject = await db.Task.findByPk(taskId);
    const taskName = taskNameObject.dataValues.name;
    const taskDueDate = taskNameObject.dataValues.due_date;
    const taskOwnerId = taskNameObject.dataValues.owner_id;

    const groupTasks = await db.Task.findAll({
      where: { group_id: groupId },
      include: { model: db.SubTask },
    });

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
    const groupInfo = await db.Group.findByPk(groupId);
    const group_id = parseInt(req.params.groupId, 10);
    const isDashboard = dashboard.id === groupId;
    //const group_id = 1
    let tasks = await db.Task.findAll({
      where: { group_id },
      order: [["due_date", "ASC"]],
    });

    if (isDashboard) {
      tasks = await db.Task.findAll({
        where: { owner_id: userId },
        order: [["due_date", "ASC"]],
      });
    }

    const Subtask = await db.SubTask.findAll({
      where: { task_id: taskId },
    });

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
      Subtask,
      taskOwnerId,
      ownerId,
      dashboard: dashboard.id,
      userName: userName.username,
      csrfToken: req.csrfToken(),
    });
  })
);

//route for editing a task HAS BUGS
router.post(
  "/:id/:groupId/:taskId",
  asyncHandler(async (req, res) => {
    let owner_id = req.params.id;
    let memberId = req.body.assignTo;
    const groupId = parseInt(req.params.groupId, 10);
    const taskId = parseInt(req.params.taskId, 10);
    const { name, due_date } = req.body;
    // owner_id = parseInt(req.params.owner_id, 10);
    // const group_id = parseInt(req.params.groupID, 10);
    // console.log(group_id);
    const group_id = groupId;
    if (memberId === undefined) {
      //console.log({ name, group_id, owner_id: memberId, due_date, completed: false });
      memberId = owner_id;
    }

    //await db.Task.update({ name, due_date, group_id, owner_id: memberId, completed: false });
    // res.redirect("users/:id/:groupId")
    await db.Task.upsert({
      id: taskId,
      name,
      group_id,
      owner_id: memberId,
      due_date,
      completed: false,
    });
    //console.log("****************************************");
    //console.log(owner_id);
    //console.log(req.originalUrl);
    res.redirect(req.originalUrl);
  })
);

router.post(
  "/:id/:groupId/:taskId/delete",
  asyncHandler(async (req, res) => {
    // if(req.session.auth) {
    const newtaskId = req.params.taskId;
    const task_id = parseInt(req.params.taskId);
    //console.log("////////////////////////////////////////////////////////////");
    //console.log(task_id);
    const owner_id = req.session.auth.userId;
    // const task_id = 1
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
    res.redirect("/:id/:groupId/:taskId/");
    // }
  })
);

// adding a subtask
router.post(
  "/:id/:groupId/:taskId/addSubTask",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const task_id = parseInt(req.params.taskId, 10);
    //db.Task.create({ name, group_id, owner_id: memberId, due_date, completed: false });
    // res.redirect("users/:id/:groupId")
    await db.SubTask.create({ name, task_id });
    res.redirect("back");
  })
);

//deleting a subtask
router.post(
  "/:id/:groupId/:taskId/:subTaskId/delete",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const subTaskId = req.params.subTaskId;
    console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
    const subTask = await db.SubTask.findByPk(subTaskId);
    if (subTask) {
      await subTask.destroy();
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
    res.redirect("back");
  })
);

module.exports = router;
