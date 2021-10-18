'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('Users', [
     {username: 'Test1', email: 'email1@test.com', hashed_password: 'password1', createdAt: new Date(), updatedAt: new Date()},
     {username: 'Test2', email: 'email2@test.com', hashed_password: 'password2', createdAt: new Date(), updatedAt: new Date()},
     {username: 'Test3', email: 'email3@test.com', hashed_password: 'password3', createdAt: new Date(), updatedAt: new Date()},
   ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Users', null, {});
  }
};
