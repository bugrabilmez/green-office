'use strict';
const options = require('./options');

module.exports = (sequelize, DataTypes) => {
    const entAnswer = sequelize.define('EntAnswer', {
        answer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        answerInfo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        isTrue: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, options('EntAnswer'));

    return entAnswer;
}