'use strict';
const options = require('./options');

module.exports = (sequelize, DataTypes) => {
    const entCompetitorAnswer = sequelize.define('EntCompetitorAnswer', {
        identity: {
            type: DataTypes.STRING,
            allowNull: false
        },
        answerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, options('EntCompetitorAnswer'));

    return entCompetitorAnswer;
}