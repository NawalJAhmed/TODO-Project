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

    let currentMemberIds = []
    const getIds = (members) => {
        for(let i=0; i<members.groupToMember.length; i++) {
            currentMemberIds.push(members.groupToMember[i].dataValues.id)
        }
    }
    getIds(members)

    const ownerId = members.dataValues.owner_id;
    const ownerName = await db.User.findByPk(ownerId);
    const userName = await db.User.findByPk(userId);
    const isOwner = userId === ownerId;

    const users = await db.User.findAll({
        include: { model: db.Group, as: 'userToMember'},
        where: {
        id: {
            [Op.notIn]: currentMemberIds,
            [Op.ne]: ownerId
        }
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

    const groupInfo = await db.Group.findByPk(groupId);
    const group_id = parseInt(req.params.groupId, 10);
    //const group_id = 1
    const tasks = await db.Task.findAll({
      where: { group_id },
      order: [["due_date", "ASC"]],
    });
    res.render("groupInfo", {
      ownerName,
      isOwner,
      users,
      members,
      groups,
      ownerGroups,
      tasks,
      userId,
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
    //req.params returning empty object. Is this because post url doesn't match current page's url?
    //const groupId = parseInt(req.params.groupId, 10);
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
      for(let i= 0; i < members.length; i++) {
          await members[i].destroy()
      }
    }
    const group = await db.Group.findByPk(groupId);
    await group.destroy();



    res.redirect("back");
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

//post route for creating a new task
router.post(
  "/:id/:groupId",
  asyncHandler(async (req, res) => {
    const owner_id = req.params.id;
    const { name, due_date } = req.body;
    // owner_id = parseInt(req.params.owner_id, 10);
    console.log("??????????????????????????????/");
    console.log("++++++++++++++");
    console.log(req.body.group_name);
    console.log(owner_id);
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&77");
    // const group_id = parseInt(req.params.groupID, 10);
    // console.log(group_id);
    const group_id = req.body.group_name;
    //console.log({ name, group_id, owner_id, due_date, completed: false });
    db.Task.create({ name, group_id, owner_id, due_date, completed: false });
    // res.redirect("users/:id/:groupId")
    res.redirect(req.originalUrl);
  })
);

// router.get(
//   "/:id/:groupId/add-task",
//   asyncHandler(async (req, res) => {
//     const userId = parseInt(req.params.id, 10);
//     const groupId = parseInt(req.params.groupId, 10);
//     // const taskId = parseInt(req.params.taskId, 10);
//     const groupTasks = await db.Task.findAll({
//       where: { group_id: groupId },
//       include: { model: db.SubTask },
//     });

//     const members = await db.Member.findAll({
//       where: { group_id: groupId },
//     });

//     const groups = await db.User.findByPk(userId, {
//         include: {model: db.Group, as: 'userToMember'},
//     })

//     const ownerGroups = await db.Group.findAll({
//         where: {owner_id: userId}
//     })
//     console.log('!!!!!', ownerGroups)

//     //querying from members and using userId
//     //or user.findbypk include group

//     const groupInfo = await db.Group.findByPk(groupId);
//     const group_id = parseInt(req.params.groupId, 10);
//     //const group_id = 1
//     const tasks = await db.Task.findAll({
//        where: {group_id},
//        order: [['due_date', 'ASC']]
//     })
//     res.render("showCompletedTasks", {
//       members,
//       groups,
//       ownerGroups,
//       tasks,
//     });
//   })
// );

// router.post(
//   "/:id/:groupId/add-task",
//   asyncHandler(async (req, res) => {
//     const { name, owner_id, due_date } = req.body;
//     const group_id = parseInt(req.params.groupID, 10);
//     //const group_id = 1
//     db.Task.create({ name, due_date, owner_id, group_id, completed: false });
//     //res.send("sent");
//     res.redirect("/:id/:groupId")
//     //res.render('groupInfo')
//   })
// );

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
    //querying from members and using userId
    //or user.findbypk include group

    const groupInfo = await db.Group.findByPk(groupId);
    const group_id = parseInt(req.params.groupId, 10);
    //const group_id = 1
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
      dashboard: dashboard.id,
      userName: userName.username,
      csrfToken: req.csrfToken(),
    });
  })
);

// router.get(
//   "/:id/:groupId/add-member",
//   csrfProtection,
//   asyncHandler(async (req, res) => {
//     const { id, groupId } = req.params;

//     res.render("members", {
//       id,
//       groupId,
//       csrfToken: req.csrfToken(),
//     });
//   })
//);

module.exports = router;
