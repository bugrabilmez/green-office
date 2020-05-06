'use strict';
const options = require('./options');

module.exports = (sequelize, DataTypes) => {
    const entContest = sequelize.define('EntUser', {
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, options('EntUser'));

    return entContest;
}