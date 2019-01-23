const jwt = require('./modules/jwt');
const configurationFactory = require('../configuration/factory').instance();
const constants = require('../common/constants');

const factory = () => {
    const _passport = () => {
        const getType = configurationFactory.getValue(constants.env.authenticationType);
        if (getType.found) {
            if (getType.value === constants.authentication.types.jwt) {
                return jwt;
            }
        } else throw new error('Undefined authentication type.');
    }

    const passport = _passport();

    const _signIn = (req, res, next) => {
        passport.signIn(req, res, next);
    };

    const _signOut = () => {

    };

    const _authenticate = (req, res, next) => {
        passport.authenticate(req, res, next);
    };

    const _register = () => {

    };

    const _initialize = () => {
        return passport.initialize();
    }

    return {
        initialize: _initialize,
        authenticate: _authenticate,
        signIn: _signIn,
        signOut: _signOut,
        register: _register
    };
}

module.exports = {
    instance: factory
}