'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      group_id: {
        allowNull: false,
        references: { model: 'groups' },
        type: Sequelize.INTEGER,
      },
      owner_id: {
        allowNull: false,
        references: { model: 'users' },
        type: Sequelize.INTEGER,
      },
      due_date: {
        type: Sequelize.DATEONLY,
      },
      completed: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tasks');
  },
};
