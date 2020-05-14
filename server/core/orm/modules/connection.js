const path = require('path');
const fs = require('fs');

const configurationFactory = require('../../configuration/factory').instance();
const constants = require('../../common/constants');

const _getInfo = () => {

    const env = configurationFactory.getEnv();

    let dbInfo = {
        database: 'databasename',
        username: 'username',
        password: 'password',
        host: 'localhost',
        dialect: 'sqlite' || 'mysql' || 'postgres'
    };

    switch (env.value) {
        case constants.environment.development:
        case constants.environment.test:
            break;
        case constants.environment.production:
            dbInfo.database = configurationFactory.getValue(constants.env.dbName).value;
            dbInfo.username = configurationFactory.getValue(constants.env.dbUsername).value;
            dbInfo.password = configurationFactory.getValue(constants.env.dbPassword).value;
            dbInfo.host = configurationFactory.getValue(constants.env.dbHost).value;
            dbInfo.dialect = configurationFactory.getValue(constants.env.dbType).value;
            break;
    }

    return dbInfo;
}

const _create = () => {

    const dbInfo = _getInfo();

    let db = {};

    const basename = path.basename(__filename);
    const dirname = __dirname + '/models/';

    const Sequelize = require('sequelize');

    const sequelize = new Sequelize(
        dbInfo.database,
        dbInfo.username,
        dbInfo.password, {
        host: dbInfo.host,
        dialect: dbInfo.dialect,
        pool: {
            max: 100,
            min: 0,
            idle: 10000,
        },
        storage: path.join(process.cwd(), 'db', 'database.sqlite'),
    });

    fs
        .readdirSync(dirname)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(file => {
            if (file.indexOf('base') < 0 && file.indexOf('options') < 0) {
                const model = sequelize['import'](path.join(dirname, file));
                db[model.name] = model;
            }
        });

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
}

const _authenticate = (db) => {
    db.sequelize.authenticate();
}

const _drop = (db) => {
    db.sequelize.drop();
}

const _sync = (db) => {
    db.sequelize.sync();
}


module.exports = {
    create: _create,
    authenticate: _authenticate,
    sync: _sync,
    drop: _drop,
    getInfo: _getInfo
}