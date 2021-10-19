
const express = require('express');
const db = require("../db/models");
const { Group, Task, SubTask } = db;
const { csrfProtection, asyncHandler } = require('./utils');
const { requireAuth } = require("../auth");
const { check, validationResult } = require('express-validator');
const router = express.Router();

// router.use(requireAuth);
// router.use(csrfProtection);


// router.get(
//     "/task",
//     csrfProtection,
//     asyncHandler(async (req, res) => {
//       //const group_id = parseInt(req.params.id, 10);
//       const group_id = 1
//       const tasks = await Task.findAll({
//          where: {group_id},
//          order: [['due_date']]
//       })
//       res.send(tasks)
//     })
//   );

router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      const task_id = parseInt(req.params.id, 10);
      //const task_id = 1
      const task = await Task.findByPk(task_id)
      const { name, due_date, completed, owner_id} = task
      console.log({ name, due_date, completed, owner_id});
      const subTasks = await SubTask.findAll({
         where: {task_id},
      })
      res.send(subTasks)
    })
)

router.post(
    "/add",
    asyncHandler(async (req, res) => {
      const { name, owner_id, due_date } = req.body;
      const group_id = parseInt(req.params.groupID, 10);
      //const group_id = 1
      Task.create({ name, due_date, owner_id, group_id, completed: false });
      res.send("sent");
      //res.render('tasks')
    })
  );

  router.put(
    "/:id/complete",
    asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
        Task.update({completed: true},
            {where: {id}})
      const group_id = parseInt(req.params.groupID, 10);
      //res.render('tasks')
      res.send('updated')
    })
  );

  router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
    // if(req.session.auth) {
        const task_id = parseInt(req.params.id, 10);
        const owner_id = req.session.auth.userId
        // const task_id = 1
        const task = await Task.findByPk(task_id);
        const subTasks = await SubTask.findAll({
            where: {task_id},
         })
        if (owner_id !== task.owner_id) {
          const err = new Error("Unauthorized");
          err.status = 401;
          err.message = "You are not authorized to delete this task.";
          err.title = "Unauthorized";
          throw err;
        }
        if (task) {
            if(subTasks.length) {
                for (const subTask of subTasks) {
                    await subTask.destroy();
                }
            }
            await task.destroy();
          res.json({ message: `Deleted task with id of ${task_id}.` });
        }
    // }
    })
  );

module.exports = router;
