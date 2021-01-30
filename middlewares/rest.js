// 第三方加密库
const CrypotJs = require("crypto-js");

module.exports = {
    APIError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },
    restify: (pathPrefix) => {
        pathPrefix = pathPrefix || '/v1/';
        return async (ctx, next) => {
            if (ctx.request.path.startsWith(pathPrefix)) {
                // 绑定rest()方法:
                ctx.rest = (data, isCache=true) => {
                    try {
                        if (isCache) {
                            let cache_key = CrypotJs.MD5(ctx.request.url).toString();
                            if (data instanceof Object) {
                                global.redisClient.set(cache_key, JSON.stringify(data));
                            } else {
                                global.redisClient.set(cache_key, data);
                            }
                            
                            global.redisClient.expire(cache_key, 120);
                        }
                    } catch (error) {
                        throw new APIError('Redis:setError', 'set key is error');
                    }
                    // console.log("?????", data);
                    ctx.response.type = 'application/json';
                    ctx.response.body = data;
                }
                try {
                    await next();
                } catch (e) {
                    // 返回错误:
                    ctx.response.status = 400;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code: e.code || 'internal:unknown_error',
                        message: e.message || ''
                    };
                }
            } else {
                await next();
            }
        };
    }
};