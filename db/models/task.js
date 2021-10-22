'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: DataTypes.STRING,
    group_id: DataTypes.INTEGER,
    owner_id: DataTypes.INTEGER,
    due_date: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
    Task.hasMany(models.SubTask, {
      foreignKey: 'task_id'
    })
    Task.belongsTo(models.User, {
      foreignKey: 'owner_id'
    })
  };
  return Task;
};
