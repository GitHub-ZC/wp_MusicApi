const CryptoJS = require('crypto-js');
const { APIError } = require('./rest');
const setting = require('../setting');


module.exports = {
    validation: (pathPrefix = '') => {
        flag = setting.is_open_validation || false;
        pathPrefix = pathPrefix || '/v1/';
        return async (ctx, next) => {
            if (flag) {
                if (ctx.request.path.startsWith(pathPrefix)) {
                    // 获取请求头 imax-music
                    let ImaxMusic = ctx.request.headers['imax-music'];

                    if (!ImaxMusic) {
                        return;
                    }

                    // Decrypt
                    var bytes = CryptoJS.AES.decrypt(ImaxMusic, (new Date()).getMinutes().toString() + 'QWEASDZXC');
                    var originalText = bytes.toString(CryptoJS.enc.Utf8);

                    start_time = parseInt(originalText);
                    // 获取当前时间戳
                    let end_time = parseInt(new Date().getTime() / 1000);

                    if (Math.abs(end_time - start_time) < 3) {
                        await next();
                    }
                } else {
                    await next();
                }
            } else {
                await next();
            }
        };
    }
};