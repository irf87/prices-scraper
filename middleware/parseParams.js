const humps = require('humps');

const parseParams = (req, res, next) => {
  if (req.body) {
    req.body = humps.decamelizeKeys(req.body);
  }
  const originalSend = res.send;
  res.send = function(data) {
    if (typeof data === 'object' && data !== null) {
      originalSend.call(this, humps.camelizeKeys(data));
    } else {
      originalSend.apply(this, arguments);
    }
  };
  next();
}

module.exports = parseParams;