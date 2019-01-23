const connection = require('./modules/connection');
const command = require('./functions/command');
const query = require('./functions/query');

const factory = () => {

    const _start = () => {
        const database = connection.create();
        connection.sync(database); 
        connection.authenticate(database);                               
        return database;
    }

    const _create = (model, entity, callback) => {
        command.create(model, entity, callback);
    }

    const _update = (model, entity, callback) => {
        command.update(model, entity, callback);
    }

    const _delete = (model, id, callback) => {
        command.delete(model, id, callback);
    }

    const _get = (model, id, callback) => {
        query.get(model, id, callback);
    }

    const _getAll = (model, callback) => {
        query.getAll(model, callback);
    }

    const _find = (model, expression, callback) => {
        query.find(model, expression, callback);
    }

    const _findOne = (model, expression, callback) => {
        query.findOne(model, expression, callback);
    }

    return {
        start: _start,
        create: _create,
        update: _update,
        delete: _delete,
        get: _get,
        getAll: _getAll,
        find: _find,
        findOne: _findOne
    }
}

module.exports = {
    instance: factory
}