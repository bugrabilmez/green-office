"use strict";
const options = require("./options");

module.exports = (sequelize, DataTypes) => {
  const entQuestion = sequelize.define(
    "EntQuestion",
    {
      contestId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false
      },
      video: {
        type: DataTypes.STRING,
        allowNull: false
      },
      second: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    options("EntQuestion")
  );

  return entQuestion;
};
