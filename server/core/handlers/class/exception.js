class Exception {
    constructor(moduleName, exception, stackTrace, created) {
        this.moduleName = moduleName;
        this.exception = exception;
        this.stackTrace = stackTrace;
        this.created = created;
    }
}

module.exports = Exception;