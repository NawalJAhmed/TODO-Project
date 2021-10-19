const express = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');

const router = express.Router();


router.get('/:id', asyncHandler(async (req, res) => {
    //const userId = parseInt(req.params.id, 10);
    const userId = 1
    const groups = await db.User.findByPk(userId,
        {include: {model: db.Group}})

    
    res.send(groups)
}));



  module.exports = router