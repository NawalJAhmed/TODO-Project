'use strict';
module.exports = (sequelize, DataTypes) => {
  const group = sequelize.define(
    'group',
    {
      name: DataTypes.STRING,
      owner_id: DataTypes.INTEGER,
      dashboard: DataTypes.BOOLEAN,
    },
    {}
  );
  group.associate = function (models) {
    // associations can be defined here
    const columnMapping = {
      through: 'member',
      foreignKey: 'group_id',
      otherKey: 'user_id',
      as: 'groupToMember',
    };
    group.belongsToMany(models.user, columnMapping);

    group.belongsTo(models.user, {
      as: 'groupToUser',
      foreignKey: 'owner_id',
    });
  };
  return group;
};
