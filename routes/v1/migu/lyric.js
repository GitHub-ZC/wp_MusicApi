const { migu_request } = require("../../../util/migu_request");
const APIError = require("../../../middlewares/rest").APIError;


let lyric = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var cid = ctx.request.query.cid || '';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var cid = ctx.request.body.cid || '';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    //https://music.migu.cn/v3/api/music/audioPlayer/getLyric
    let result = await migu_request(`https://music.migu.cn/v3/api/music/audioPlayer/getLyric`, {
        copyrightId: cid.trim()
    });
    
    global.cache.set(ctx.request.url, result.data);
    
    ctx.rest(result.data);
    // try {
    //     ctx.body = JSON.stringify(result.data);
    // } catch (error) {
    //     ctx.body = JSON.stringify({
    //         error: '服务端数据解析错误',
    //         status: 400
    //     })
    // }
    // ctx.type = 'application/json';
}

module.exports = {
    lyric
}