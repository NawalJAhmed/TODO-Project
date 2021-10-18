'use strict';
module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    user_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER
  }, {});
  Member.associate = function(models) {
    // associations can be defined here
  };
  return Member;
};