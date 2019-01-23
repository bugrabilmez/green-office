const Data = require('./class/data');

const factory = () => {
    
    // Return value according to key.
    const _getValue = (key) => {  
     
        if (process.env[key] !== null && process.env[key] !== undefined) {
            return new Data(true, key, process.env[key], null)         
        } 
        
        return new Data(false, key, null, null);

    }

    // Get environment
    const _getEnv = () => {
        return new Data(true, 'NODE_ENV', process.env.NODE_ENV, null)  
    }

    return {
        getValue: _getValue,
        getEnv: _getEnv
    }
}

module.exports = {
    instance: factory
};