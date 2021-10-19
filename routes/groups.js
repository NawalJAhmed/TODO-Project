const express = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');

const router = express.Router();


router.get('/:id', asyncHandler(async (req, res) => {
    //const userId = parseInt(req.params.id, 10);
    const userId = 1
    const groups = await db.User.findByPk(userId, {
        include: {as: 'join', model: db.Group},
        order: [['createdAt']]
    })
    res.send(groups)
}));

// router.get('/', asyncHandler(async (req, res) => {
//     //const userId = parseInt(req.params.id, 10);
//     const groups = await db.
// }))

const groupValidators = [
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for group name')  
]


// TODO test this route with logged in user
router.post('/create-group', csrfProtection, groupValidators,
  asyncHandler(async (req, res) => {
      const { name } = req.body;
      const owner_id = parseInt(req.params.id, 10);
      const group = db.Group.build({
          name,
          owner_id,
          dashboard: false
      })

      const validatorErrors = validationResult(req);

      if (validatorErrors.isEmpty()) {
          await group.save();
          res.redirect('/');
      } else {
          const errors = validatorErrors.array().map((error) => error.msg);
          res.render('group-add', {
              title: 'Add Group',
              group,
              errors,
              csrfToken: req.csrfToken()
          })
      }
  }))



  module.exports = router