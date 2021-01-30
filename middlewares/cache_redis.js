const { APIError } = require('./rest');

module.exports = {
    cache_redis: async (ctx, next) => {
        // global.redisClient.set('name', '郑超');
        // global.redisClient.expire('name', 60);
        
        try {
            let res = await global.getAsync(`${ctx.request.url}`);
            if (res) {
                ctx.rest(res, false);
                // console.log('走缓存');
            } else {
                // console.log('不走缓存');
                await next();
            }
        } catch (error) {
            throw new APIError("Redis:getError", "get key is error");
        }
        
    }
}