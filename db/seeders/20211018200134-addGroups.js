"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkInsert(
      "Groups",
      [
        {
          name: "dashboard",
          owner_id: 1,
          dashboard: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "demogroup1",
          owner_id: 1,
          dashboard: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "demogroup2",
          owner_id: 1,
          dashboard: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "demogroup3",
          owner_id: 1,
          dashboard: false,
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
    return queryInterface.bulkDelete("Groups", null, {});
  },
};
