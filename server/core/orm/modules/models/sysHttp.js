'use strict';
const options = require('./options');
const base = require('./base');

module.exports = (sequelize, DataTypes) => {

    let columns = {
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        method: {
            type: DataTypes.STRING,
            allowNull: true
        },
        originalUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        referer: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userAgent: {
            type: DataTypes.STRING,
            allowNull: true
        },
        requestData: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        responseData: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    };

    columns = Object.assign(columns, base(DataTypes));

    const SysHttp = sequelize.define('SysHttp', columns, options('SysHttp'));

return SysHttp;
}