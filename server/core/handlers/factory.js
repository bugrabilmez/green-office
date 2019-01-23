const exceptionHandler = require('./modules/exceptionHandler');
const httpHandler = require('./modules/httpHandler');

const factory = () => {

    const _exceptionHandler = (err, req, res, next) => {
        exceptionHandler.writeDb(err, req, res, next);
    }

    const _httpHandler = (req, res, next) => {
        httpHandler.writeDb(req, res, next);
    }

    return {
        exceptionHandler: _exceptionHandler,
        httpHandler: _httpHandler
    }

}

module.exports = {
    instance: factory
}