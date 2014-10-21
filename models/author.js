"use strict";

module.exports = function(sequelize, DataTypes) {
  var Author = sequelize.define("Author", {
    name: DataTypes.STRING,
    bio: DataTypes.TEXT
  }, {
    classMethods: {
        associate: function(db) {
        Author.hasMany(db.Post);
      }
    }
  });

  return Author;
};
