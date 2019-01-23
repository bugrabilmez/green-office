const _create = (model, entity, callback) => {
    model
        .create(entity)
        .then((result) => {
            callback(result);
        })
        .catch((err) => {
            console.log(err);
        })
}

const _update = (model, entity, callback) => {
    model
        .findById(entity.id)
        .then(result => {
            if (!result) {
                console.log('Model yok. Update edilemedi.');
            }

            result
                .update({
                    key: entity
                })
                .then(updatedResult => {
                    callback(updatedResult);
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
}

const _delete = (model, id, callback) => {
    model
        .findById(entity.id)
        .then(result => {
            if (!result) {
                console.log('Model yok. Update edilemedi.');
            }

            result
                .destroy()
                .then(() => {
                    callback(true);
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = {
    create: _create,
    update: _update,
    delete: _delete
}