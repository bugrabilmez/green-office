class httpLogging {
    constructor(ipAddress, method, originalUrl, url, referer, userAgent, requestData, responseData, created) {
        this.ipAddress = ipAddress;
        this.method = method;
        this.originalUrl = originalUrl;
        this.url = url;
        this.referer = referer;
        this.userAgent = userAgent;
        this.requestData = requestData;
        this.responseData = responseData; 
        this.created = created;
    }
}

module.exports = httpLogging;