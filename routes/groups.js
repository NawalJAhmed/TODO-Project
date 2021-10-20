const express = require("express");
const { check, validationResult } = require("express-validator");
const { Op } = require("sequelize");

const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");

const router = express.Router();

// this route returns groups that a given user belongs to
// TODO add groups, tasks, sub-tasks
router.get(
  "/:id/:groupId",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const groupId = parseInt(req.params.groupId, 10);

    const groupTasks = await db.Task.findAll({
      where: { group_id: groupId },
      include: { model: db.SubTask },
    });

    const members = await db.Member.findAll({
      where: { group_id: groupId },
    });

    const groups = await db.User.findByPk(userId, {
        include: {model: db.Group, as: 'userToMember'},
    })
    //console.log('!!!!!!!!', groups.dataValues.userToMember)
    //querying from members and using userId
    //or user.findbypk include group
    
    const groupInfo = await db.Group.findByPk(groupId);
    res.render("groupInfo", {
      members,
      groups
    });
  })
);

//sample page to post a form that creates a group
router.get(
  "/:id/create-group",
  csrfProtection,
  asyncHandler(async (req, res) => {
    res.render("groups", {
      csrfToken: req.csrfToken(),
    });
  })
);

router.get(
  "/:id/:groupId/add-member",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const { id, groupId } = req.params;

    res.render("members", {
      id,
      groupId,
      csrfToken: req.csrfToken(),
    });
  })
);

const groupValidators = [
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for group name"),
];

// TODO test this route with logged in user
router.post(
  "/:id/create-group",
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
      res.redirect("/");
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

const memberValidators = [
  check("user_id")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for member name"),
];

router.post(
  "/:id/:groupId/add-member",
  memberValidators,
  asyncHandler(async (req, res) => {
    const { user_id } = req.body;
    const groupId = parseInt(req.params.groupId, 10);
    const member = db.Member.build({
      user_id,
      group_id: groupId,
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await member.save();
      res.redirect("/");
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("members", {
        title: "Add a member",
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

router.post(
  "/:id/:groupId/delete-group",
  asyncHandler(async (req, res) => {
    const groupId = parseInt(req.params.groupId, 10);
    const group = await db.Group.findByPk(groupId);
    await group.destroy();

    const members = await db.Member.findAll({ where: { group_id: groupId } });
    if (members) {
      await members.destroy();
    }

    res.redirect("/");
  })
);

//TODO requires testing once members have been added
router.post(
  "/:id/:groupId/leave-group",
  asyncHandler(async (req, res) => {
    const groupId = parseInt(req.params.groupId, 10);
    const userId = parseInt(req.params.id, 10);
    const member = await db.Member.findOne({
      where: {
        [Op.and]: [{ user_id: userId }, { group_id: groupId }],
      },
    });

    await member.destroy();
    res.redirect("/");
  })
);

module.exports = router;
