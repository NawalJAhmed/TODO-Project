'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sub - Task = sequelize.define('Sub-Task', {
    name: DataTypes.STRING,
    task_id: DataTypes.INTEGER
  }, {});
  Sub - Task.associate = function(models) {
    // associations can be defined here
  };
  return Sub - Task;
};