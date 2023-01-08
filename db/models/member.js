'use strict';
module.exports = (sequelize, DataTypes) => {
  const member = sequelize.define(
    'member',
    {
      user_id: DataTypes.INTEGER,
      group_id: DataTypes.INTEGER,
    },
    {}
  );
  member.associate = function (models) {
    // associations can be defined here
  };
  return member;
};
