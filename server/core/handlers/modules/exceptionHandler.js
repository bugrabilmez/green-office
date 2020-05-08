const Log = require('../class/exception');
const ormFactory = require('../../orm/factory').instance();
const { isNil } = require('lodash');

const _writeDb = (err, req, res, next) => {

    const log = new Log(
        req.url,
        err.message,
        err.stack
    );

    if (!isNil(req.user) && !isNil(req.user.identityNumber))
        log.created = req.user.identityNumber;

    ormFactory.create(req.app.locals.db.SysException, log)
        .then((result) => { })
        .catch((err) => {
            console.log(err);
        });

    next(err);
}

module.exports = {
    writeDb: _writeDb
}