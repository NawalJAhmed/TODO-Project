'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: DataTypes.STRING,
    group_id: DataTypes.INTEGER,
    owner_id: DataTypes.INTEGER,
    due_date: DataTypes.DATE,
    completed: DataTypes.BOOLEAN
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
  };
  return Task;
};