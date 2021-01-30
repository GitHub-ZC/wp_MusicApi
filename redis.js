const { promisify } = require("util");

// 开启redis客户端连接
const redis = require("redis");
global.redisClient = redis.createClient({
    // host: 'iecoxe.top',
    prefix: 'wpmusic_'
});

global.getAsync = promisify(global.redisClient.get).bind(global.redisClient);


global.redisClient.on("error", function(err) {
    console.log(`redis error: ${err}`);
});