const _get = (model, id) => {
    return model.findById(id)
}

const _getAll = (model) => {
    return model.findAll();
}

const _find = (model, expression) => {
    return model.findAll({ where: expression })
}

const _findOne = (model, expression) => {
    return model.findOne({ where: expression })
}

module.exports = {
    get: _get,
    getAll: _getAll,
    find: _find,
    findOne: _findOne
}