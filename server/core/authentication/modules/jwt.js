const _ = require('lodash');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passport_jwt = require('passport-jwt');
const configurationFactory = require('../../configuration/factory').instance();
const constants = require('../../common/constants');

const users = [
    {
        id: 1,
        identityNumber: 13151153808,
        name: 'admin',
        password: 'admin'
    },
    {
        id: 2,
        identityNumber: 13151153808,
        name: 'test',
        password: 'test'
    }
];

const ExtractJwt = passport_jwt.ExtractJwt;
const JwtStrategy = passport_jwt.Strategy;
const secretOrKey = configurationFactory.getValue(constants.env.authenticationSecretKey);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(constants.authentication.types.jwt),
    secretOrKey: secretOrKey.value
};

const strategy = new JwtStrategy(jwtOptions, (payload, done) => {
    console.log('payload received', payload);
    // db
    const user = users[_.findIndex(users, { id: payload.id })];
    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
});

passport.use(strategy);

const _initialize = () => {
    return passport.initialize();
};

const _authenticate = (req, res, next) => {
    passport.authenticate(constants.authentication.types.jwt, { session: false })(req, res, next);
};

const _signIn = (req, res, next) => {
    const name = req.body.name;
    const password = req.body.password;
    // usually this would be a database call:
    var user = users[_.findIndex(users, { name: name })];
    if (!user) {
        res.status(401).json({ message: "no such user found" });
    }

    if (user.password === req.body.password) {
        // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
        var payload = { id: user.id };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ message: "ok", token: token });
    } else {
        res.status(401).json({ message: "passwords did not match" });
    }
};

module.exports = {
    signIn: _signIn,
    initialize: _initialize,
    authenticate: _authenticate
};