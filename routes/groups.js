const express = require("express");
const { check, validationResult } = require("express-validator");
const { Op } = require("sequelize");

const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");
const { requireAuth } = require("../auth");
const { sequelize } = require("../db/models");
const router = express.Router();
router.use(requireAuth);
// this route returns groups that a given user belongs to
// Quicklist add groups, tasks, sub-tasks

router.get(
  [
    "/:id/:groupId",
    "/:id/:groupId/taskList",
    "/:id/:groupId/completed",
    "/:id/:groupId/completed/:taskId",
    "/:id/:groupId/completed/taskList",
    "/:id/:groupId/groupView",
    "/:id/:groupId/update",
  ],
  csrfProtection,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const groupId = parseInt(req.params.groupId, 10);
    console.log("HELOOOOOOOOOOOOOO");
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

    const isDashboard = dashboard.id === groupId;
    const groupNameObject = await db.Group.findOne({
      attributes: ["name"],
      where: { id: groupId },
    });
    const groupName = groupNameObject.dataValues.name;
    const group_id = parseInt(req.params.groupId, 10);

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

    let arrayOfAllDashBoardIds = [];
    const dashBoardIds = await sequelize.query(
      `SELECT id, name FROM "Groups" WHERE dashboard = true UNION SELECT id, name FROM "Tasks" WHERE group_id = ${userId}`
    );
    const neededDashBoardIdsInfo = dashBoardIds[0];
    neededDashBoardIdsInfo.forEach((e) => {
      for (id in e) {
        arrayOfAllDashBoardIds.push(e[id]);
      }
    });
    let vars = {
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
      ownerId,
      dashBoardIds,
      dashboard: dashboard.id,
      userName: userName.username,
      csrfToken: req.csrfToken(),
    };
    if (req.url.endsWith("taskList")) {
      return res.render("taskList", {
        tasks,
        userId,
        groupId,
        csrfToken: req.csrfToken(),
      });
    }
    if (req.url.endsWith("groupView")) {
      return res.render("groupView", vars);
    }
    if (req.url.endsWith("update")) {
      return res.render("updateMemberDrop", vars);
    }

    res.render("groupSide", vars);
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

module.exports = router;
