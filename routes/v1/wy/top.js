const APIError = require("../../../middlewares/rest").APIError;
const { default: axios } = require("axios");
const { weapi } = require('../../../util/crypto');
const qs = require('qs');

// 排行榜分类
let topCategory = async (ctx) => {
    if (ctx.request.method === 'GET') {
        // var from = ctx.request.query.from || 'pc';
    } else if (ctx.request.method === 'POST') {
        // var from = ctx.request.body.from || 'pc';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let result = await axios.post('https://music.163.com/weapi/toplist/detail', qs.stringify(weapi({
        csrf_token: ''
    })), {
        method: 'post',
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
            origin: 'https://music.163.com'
        }
    });

    global.cache.set(ctx.request.url, result.data, 3600);

    ctx.rest(result.data);
}

module.exports = {
    topCategory
}