'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkInsert(
      'subtasks',
      [
        {
          name: 'subTask1',
          task_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'subTask2',
          task_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'subTask3',
          task_id: 1,
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
    return queryInterface.bulkDelete('subtasks', null, {});
  },
};
