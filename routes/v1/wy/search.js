const APIError = require("../../../middlewares/rest").APIError;
const { default: axios } = require("axios");
const { eapi } = require('../../../util/crypto');
const cookie_util = require("../../../util/cookie_util");
const qs = require('qs')


let search = async (ctx) => {
     // 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
    if (ctx.request.method === 'GET') {
        var key = ctx.request.query.key || '';
        var limit = ctx.request.query.limit || '30';
        var offset = ctx.request.query.offset || '1';
        var type = ctx.request.query.type || '1';
    } else if (ctx.request.method === 'POST') {
        var key = ctx.request.body.key || '';
        var limit = ctx.request.body.limit || '30';
        var offset = ctx.request.body.offset || '1';
        var type = ctx.request.body.type || '1';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let result = await axios.post('http://interface.music.163.com/eapi/batch', qs.stringify(eapi('/api/cloudsearch/pc', {
        s: key,
        type: parseInt(type),
        limit: parseInt(limit),
        total: offset == 1,
        offset: parseInt(limit) * (parseInt(offset) - 1),
    })), {
        method: 'post',
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
            origin: 'https://music.163.com',
            Cookie: cookie_util.serialization(global.wy_cookie)
        }
    });


    global.cache.set(ctx.request.url, result.data);
    // 捕捉服务端解析错误，防止程序退出
    ctx.rest(result.data);
}


module.exports = {
    search
}