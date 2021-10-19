'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    hashed_password: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    const columnMapping = {
      through: 'Member',
      foreignKey: 'user_id',
      otherKey: 'group_id',
      as: 'userToMember'
    }
    User.belongsToMany(models.Group, columnMapping)
    User.hasMany(models.Group, {
      foreignKey: 'group_id',
      as: 'userToGroup'
    })
    User.hasMany(models.Task, {
      foreignKey: 'owner_id',

    })
  };
  return User;
};
