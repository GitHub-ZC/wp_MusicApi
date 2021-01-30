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
                    if (isCache) {
                        if (data instanceof Object) {
                            global.redisClient.set(`${ctx.request.url}`, JSON.stringify(data));
                        } else {
                            global.redisClient.set(`${ctx.request.url}`, data);
                        }
                        
                        global.redisClient.expire(`${ctx.request.url}`, 120);
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