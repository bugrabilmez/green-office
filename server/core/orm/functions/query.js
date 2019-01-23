const _get = (model, id, callback) => {

    model
        .findById(id)
        .then(result => {
            callback(result)
        })
        .catch(err => {
            console.log(err);
        })
}

const _getAll = (model, callback) => {
    model
        .findAll()
        .then(result => {
            callback(result);
        })
        .catch(err => {
            console.log(err);
        })
}

const _find = (model, expression, callback) => {
    model
        .findAll({ where: expression })
        .then(result => {
            callback(result);
        })
        .catch(err => {
            console.log(err);
        })
}

const _findOne = (model, expression, callback) => {
    model
        .findOne({ where: expression })
        .then(result => {
            callback(result);
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = {
    get: _get,
    getAll: _getAll,
    find: _find,
    findOne: _findOne
}