'use strict';
const options = require('./options');
const base = require('./base');

module.exports = (sequelize, DataTypes) => {

    let columns = {
        moduleName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        exception: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        stackTrace: {
            type: DataTypes.TEXT,
            allowNull: true
        }        
    };

    columns = Object.assign(columns, base(DataTypes));

    const model = sequelize.define('SysException', columns, options('SysException'));

    return model;
}