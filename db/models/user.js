'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      hashed_password: DataTypes.STRING,
    },
    {}
  );
  user.associate = function (models) {
    // associations can be defined here
    const columnMapping = {
      through: 'member',
      foreignKey: 'user_id',
      otherKey: 'group_id',
      as: 'userToMember',
    };
    user.belongsToMany(models.group, columnMapping);

    user.hasMany(models.group, {
      as: 'userToGroup',
      foreignKey: 'owner_id',
    });

    user.hasMany(models.task, {
      foreignKey: 'owner_id',
    });
  };
  return user;
};
