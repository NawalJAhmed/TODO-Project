'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: DataTypes.STRING,
    owner_id: DataTypes.INTEGER,
    dashboard: DataTypes.BOOLEAN
  }, {});
  Group.associate = function(models) {
    // associations can be defined here
    const columnMapping = {
      through: 'Member',
      foreignKey: 'group_id',
      otherKey: 'user_id',
      as: 'groupToMember'
    }
    Group.belongsToMany(models.User, columnMapping)

    Group.belongsTo(models.User, {
      as: 'groupToUser',
      foreignKey: 'owner_id'
    })
  };
  return Group;
};
