const { default: axios } = require("axios");
const { qq_request } = require("../../../util/qq_request");
const APIError = require("../../../middlewares/rest").APIError;


let playlist_Info = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var pid = ctx.request.query.pid || '2642142791';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var pid = ctx.request.body.pid || '2642142791';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    if (pid.length === 0) {
        throw new APIError("QQ_playlist", "pid not found");
    }

    // let result = await qq_request(`http://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg`, {
    //     type: 1,
    //     utf8: 1,
    //     disstid: pid.trim(), // 歌单的id
    //     loginUin: 0,
    //     format: 'json'
    // });

    let result = await axios.get(`https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&new_format=1&disstid=${pid.trim()}&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0',
            Referer: 'https://y.qq.com/',
            Host: 'u.y.qq.com'
        }
    });
    global.cache.set(ctx.request.url, result.data);
    
    ctx.rest(result.data);
    result = null;
}

module.exports = {
    playlist_Info
}