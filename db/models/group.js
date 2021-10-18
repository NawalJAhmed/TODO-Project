'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: DataTypes.STRING,
    owner_id: DataTypes.INTEGER,
    dashboard: DataTypes.BOOLEAN
  }, {});
  Group.associate = function(models) {
    // associations can be defined here
  };
  return Group;
};