const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient({ host: 'redis' });

const redisClientAsync = {
    set: promisify(redisClient.set).bind(redisClient),
    get: promisify(redisClient.get).bind(redisClient)
}

module.exports = redisClientAsync;