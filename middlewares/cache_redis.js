const { APIError } = require('./rest');
// 第三方加密库
const CrypotJs = require("crypto-js");

module.exports = {
    cache_redis: async (ctx, next) => {
        
        // console.log(CrypotJs.MD5(ctx.request.url).toString());
        try {
            var res = await global.getAsync(CrypotJs.MD5(ctx.request.url).toString());
        } catch (error) {
            throw new APIError("Redis:getError", "get key is error");
        }
        
        if (res) {
            ctx.rest(res, false);
            // console.log('走缓存');
        } else {
            // console.log('不走缓存');
            await next();
        }
    }
}