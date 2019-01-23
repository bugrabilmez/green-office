'use strict';
const options = require('./options');

module.exports = (sequelize, DataTypes) => {
    const entAnswer = sequelize.define('EntAnswer', {
        answer: {
            type: DataTypes.STRING,
            allowNull: false
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