'use strict';
module.exports = (sequelize, DataTypes) => {
  const subtask = sequelize.define(
    'subtask',
    {
      name: DataTypes.STRING,
      task_id: DataTypes.INTEGER,
    },
    {}
  );
  subtask.associate = function (models) {
    // associations can be defined here
    subtask.belongsTo(models.task, {
      foreignKey: 'task_id',
    });
  };
  return subtask;
};
