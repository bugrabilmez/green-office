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

    const _create = (model, entity) => {
        return command.create(model, entity);
    }

    const _update = (model, entity) => {
        return command.update(model, entity);
    }

    const _delete = (model, id) => {
        return command.delete(model, id);
    }

    const _get = (model, id) => {
        return query.get(model, id);
    }

    const _getAll = (model) => {
        return query.getAll(model);
    }

    const _find = (model, expression) => {
        return query.find(model, expression);
    }

    const _findOne = (model, expression) => {
        return query.findOne(model, expression);
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