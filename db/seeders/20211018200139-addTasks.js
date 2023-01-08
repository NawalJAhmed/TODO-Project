'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkInsert(
      'tasks',
      [
        {
          name: 'Task1',
          group_id: 1,
          owner_id: 1,
          due_date: '2021-10-31',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Task2',
          group_id: 1,
          owner_id: 1,
          due_date: '2021-10-30',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Task3',
          group_id: 1,
          owner_id: 2,
          due_date: '2021-10-29',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Task3',
          group_id: 1,
          owner_id: 2,
          due_date: '2021-10-29',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Task3',
          group_id: 1,
          owner_id: 3,
          due_date: '2021-10-29',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Task3',
          group_id: 1,
          owner_id: 3,
          due_date: '2021-10-29',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Task3',
          group_id: 1,
          owner_id: 4,
          due_date: '2021-10-29',
          completed: false,
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
    return queryInterface.bulkDelete('tasks', null, {});
  },
};
