const { qq_request } = require("../../../util/qq_request");
const APIError = require("../../../middlewares/rest").APIError;


let lyric = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var mid = ctx.request.query.mid || '004O1DHG4MjYOi';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var mid = ctx.request.body.mid || '004O1DHG4MjYOi';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let result = await qq_request(`https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg`, {
        songmid: mid.trim(),
        format: 'json',
        nobase64: 1,
        g_tk: 5381
    });

    global.cache.set(ctx.request.url, result.data);
    
    ctx.rest(result.data);
    result = null;
}

module.exports = {
    lyric
}