const { kuwo_request } = require("../../../util/kuwo_request");
const APIError = require("../../../middlewares/rest").APIError;


let song = async (ctx) => {

    if (ctx.request.method === 'GET') {
        var rid = ctx.request.query.rid || '156483846';
        var br = ctx.request.query.br || '320';
    } else if (ctx.request.method === 'POST') {
        var rid = ctx.request.body.rid || '156483846';
        var br = ctx.request.body.br || '320';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    // aac：24，48
    // wma：96，128
    // mp3：128，192，320
    // ape：1000
    // flac：2000    无法获取，等待以后逆向
    // let format = 'mp3';
    // switch (br) {
    //     case '24':
    //     case '48':
    //         format = 'aac';
    //         break;
    //     case '96':
    //         format = 'wma';
    //         break;
    //     case '128':
    //     case '192':
    //     case '320':
    //         format = 'mp3';
    //         break;
    //     case '1000':
    //         format = 'ape';
    //         break;
    //     case '2000':
    //         format = 'flac';
    //         break;
    //     default:
    //         format = 'format_error';
    // }

    // if (format === 'format_error') {
    //     throw new APIError("Song:br_error", "br is not 24, 48, 96, 128, 192, 320, 1000");
    // }

    // let result = await kuwo_request('http://kuwo.cn/url', {
    //     br: `${br}k${format}`,
    //     type: 'convert_url3',
    //     rid: rid.trim()
    //     // from: 'pc'
    // })
    // console.log(result);
    // 捕获序列化json出错，防止程序异常退出

    let result = await kuwo_request('http://www.kuwo.cn/api/v1/www/music/playUrl', {
        // br: `${br}k${format}`,
        type: 'music',
        mid: rid.trim()
        // from: 'pc'
    })
    if (result.data === 'failed') {
        throw new APIError("Song:url_notfound", "Song url is not found")
    }
    
    global.cache.set(ctx.request.url, result.data);
    
    ctx.rest(result.data);
}


let songInfo = async (ctx) => {

    if (ctx.request.method === 'GET') {
        var rid = ctx.request.query.rid || '156483846';
    } else if (ctx.request.method === 'POST') {
        var rid = ctx.request.body.rid || '156483846';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let result = await kuwo_request('http://kuwo.cn/api/www/music/musicInfo', {
        mid: rid.trim(),
        httpsStatus: 1,
        reqId: 'fe4ca711-9317-11ec-b143-115a6c5b31c8'
    });

    global.cache.set(ctx.request.url, result.data);

    ctx.rest(result.data);
}

module.exports = {
    song,
    songInfo
}