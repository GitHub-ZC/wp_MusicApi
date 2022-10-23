const { default: axios } = require("axios");
const APIError = require("../../../middlewares/rest").APIError;
const qs = require('qs');
const { serialization } = require('../../../util/cookie_util');
const encrypt = require('../../../util/crypto');

let recommendSongs = async (ctx) => {
    if (ctx.request.method === 'GET') {
    } else if (ctx.request.method === 'POST') {
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }


    let data = {};
    let csrfToken = (serialization(global.wy_cookie) || '').match(/_csrf=([^(;|$)]+)/);
    data.csrf_token = csrfToken ? csrfToken[1] : '';
    data = encrypt.weapi(data);


    let result = await axios.post(`https://music.163.com/api/v3/discovery/recommend/songs`, qs.stringify(data), {
        headers: {
            "User-Agent": 'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BKK-AL10 Build/HONORBKK-AL10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/10.6 Mobile Safari/537.36',
            Referer: 'https://music.163.com',
            cookie: serialization(global.wy_cookie)
        }
    });

    global.cache.set(ctx.request.url, result.data);

    ctx.rest(result.data);
}

module.exports = {
    recommendSongs
}