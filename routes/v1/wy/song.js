const APIError = require("../../../middlewares/rest").APIError;
const { default: axios } = require("axios");
const { s } = require("../../../util/sssss");
var Qs = require("qs");
const cookie_util = require("../../../util/cookie_util");


let song = async (ctx) => {

    if (ctx.request.method === 'GET') {
        var id = ctx.request.query.id || '002mZevo3wHvsc';
        var br = ctx.request.query.br || '128';
    } else if (ctx.request.method === 'POST') {
        var id = ctx.request.body.id || '002mZevo3wHvsc';
        var br = ctx.request.body.br || '320';
    }


    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    // "ids": "[167655, 353066]"
    let result = await axios.post(`https://music.163.com/weapi/song/enhance/player/url/v1?csrf_token=`, Qs.stringify(s(id)), {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            Referer: 'https://music.163.com/',
            Host: 'music.163.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            Origin: 'https://music.163.com',
            Cookie: cookie_util.serialization(global.wy_cookie)
        }
    })



    global.cache.set(ctx.request.url, [result.data]);


    ctx.rest([result.data]);
    // ctx.rest(result.data);
    result = null;
}


// let songInfo = async (ctx) => {

//     if (ctx.request.method === 'GET') {
//         var rid = ctx.request.query.rid || '156483846';
//     } else if (ctx.request.method === 'POST') {
//         var rid = ctx.request.body.rid || '156483846';
//     }

//     let result = await qq_request('http://kuwo.cn/api/www/music/musicInfo', {
//         mid: rid.trim(),
//         httpsStatus: 1,
//         reqId: 'e3f36a20-4c05-11eb-b0b7-8b03aa7e4b0d'
//     });

//     ctx.rest(result.data);
// }

module.exports = {
    song
    // songInfo
}