module.exports = {

    // Environment file constants
    env: {
        host: 'APPLICATION_HOST',
        port: 'APPLICATION_PORT',
        language: 'APPLICATION_LANGUAGE',
        authenticationType: 'AUTHENTICATION_TYPE',
        authenticationSecretKey: 'AUTHENTICATION_SECRET_KEY',
        dbType: 'DB_TYPE',
        dbHost: 'DB_HOST',
        dbName: 'DB_NAME',
        dbUsername: 'DB_USERNAME',
        dbPassword: 'DB_PASSWORD'        
    },

    // Core constants
    authentication: {
        types: {
            jwt: 'jwt'
        }
    },

    // Environment constants
    environment: {
        development: 'development',
        test: 'test',
        production: 'production'
    }

};