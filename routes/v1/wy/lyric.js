const { default: axios } = require("axios");
const APIError = require("../../../middlewares/rest").APIError;
const qs = require('qs');

let lyric = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var wid = ctx.request.query.wid || '';
    } else if (ctx.request.method === 'POST') {
        var wid = ctx.request.body.wid || '';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let result = await axios.post(`https://music.163.com/api/song/lyric?_nmclfl=1`, qs.stringify({
        id: parseInt(wid.trim()),
        tv: -1,
        lv: -1,
        rv: -1,
        kv: -1,
    }), {
        headers: {
            "User-Agent": 'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BKK-AL10 Build/HONORBKK-AL10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/10.6 Mobile Safari/537.36',
            Referer: 'https://music.163.com'
        }
    });

    global.cache.set(ctx.request.url, result.data);

    ctx.rest(result.data);
}

module.exports = {
    lyric
}