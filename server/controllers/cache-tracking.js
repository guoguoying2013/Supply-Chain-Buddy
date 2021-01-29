const redis = require('redis');

const portRedis = 6379;
const redisClient = redis.createClient(portRedis);

const cacheInfo = async (trackingId, data) => {
  redisClient.setex(trackingId, 86400, JSON.stringify(data));
};

const checkCache = (req, res, next) => {
  const { id } = req.query;
  redisClient.get(id, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    if (data != null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};

module.exports.cacheInfo = cacheInfo;
module.exports.checkCache = checkCache;
