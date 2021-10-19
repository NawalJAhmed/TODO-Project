'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('Members', [
     {user_id: 1, group_id: 1, createdAt: new Date(), updatedAt: new Date()},
     {user_id: 2, group_id: 1, createdAt: new Date(), updatedAt: new Date()},
     {user_id: 3, group_id: 1, createdAt: new Date(), updatedAt: new Date()},
     {user_id: 3, group_id: 2, createdAt: new Date(), updatedAt: new Date()},
     {user_id: 4, group_id: 2, createdAt: new Date(), updatedAt: new Date()},
   ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Members', null, {});
  }
};
