'use strict';
module.exports = (sequelize, DataTypes) => {
  const task = sequelize.define(
    'task',
    {
      name: DataTypes.STRING,
      group_id: DataTypes.INTEGER,
      owner_id: DataTypes.INTEGER,
      due_date: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {}
  );
  task.associate = function (models) {
    // associations can be defined here
    task.hasMany(models.subtask, {
      foreignKey: 'task_id',
    });
    task.belongsTo(models.user, {
      foreignKey: 'owner_id',
    });
  };
  return task;
};
