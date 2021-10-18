'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubTask = sequelize.define('SubTask', {
    name: DataTypes.STRING,
    task_id: DataTypes.INTEGER
  }, {});
  SubTask.associate = function(models) {
    // associations can be defined here
    SubTask.belongsTo(models.Task, {
      foreignKey: 'task_id'
    })
  };
  return SubTask;
};
