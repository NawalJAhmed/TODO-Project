'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkInsert(
      'users',
      [
        {
          username: 'demo',
          email: 'demo@test.com',
          hashed_password: bcrypt.hashSync('Demouser1!', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'billy',
          email: 'email1@test.com',
          hashed_password: bcrypt.hashSync('Password1!', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'bob',
          email: 'email2@test.com',
          hashed_password: bcrypt.hashSync('Password2!', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'jandice',
          email: 'email3@test.com',
          hashed_password: bcrypt.hashSync('Password3!', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkDelete('users', null, {});
  },
};
