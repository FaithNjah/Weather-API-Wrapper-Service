const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URL
});

client.on('error', (err) => {
    console.log('Redis Client Error', err);
});

client.on('connect', () => {
    console.log('Connected to Redis Cloud!');
});

client.connect().then(() => {
    console.log('Redis ready for caching!');
}).catch((err) => {
    console.log('Redis connection failed:', err);
});

module.exports = client;