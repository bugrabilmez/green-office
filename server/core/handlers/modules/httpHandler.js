const Log = require('../class/http');
const ormFactory = require('../../orm/factory').instance();
const _ = require('lodash');

const _writeDb = (req, res,next) => {

    const oldWrite = res.write;
    const oldEnd = res.end;
  
    const chunks = [];
  
    res.write = (...restArgs) => {
      chunks.push(new Buffer(restArgs[0]));
      oldWrite.apply(res, restArgs);
    };
  
    res.end = (...restArgs) => {

      if (restArgs[0]) {
        chunks.push(new Buffer(restArgs[0]));
      }

    const body = Buffer.concat(chunks).toString('utf8');

    const log = new Log(
        req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        req.method,
        req.originalUrl,
        req.url,
        JSON.stringify(req.headers.referer) || '',
        req.headers['user-agent'],
        JSON.stringify(req.body),
        body       
    );

    if (!_.isNil(req.user) && !_.isNil(req.user.identityNumber))
      log.created = req.user.identityNumber;

    ormFactory.create(req.app.locals.db.SysHttp, log, () => {});

    oldEnd.apply(res, restArgs);
   };
  
   next();
}

module.exports = {
    writeDb: _writeDb
}