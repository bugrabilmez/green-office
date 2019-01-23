'use strict';
const options = require('./options');

module.exports = (sequelize, DataTypes) => {
    const entContest = sequelize.define('EntContest', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startingDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        isCompleted: {
            type: DataTypes.BOOLEAN,
        }
    }, options('EntContest'));

    return entContest;
}