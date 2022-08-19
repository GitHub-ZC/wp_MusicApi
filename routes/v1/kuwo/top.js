const { kuwo_request } = require("../../../util/kuwo_request");
const APIError = require("../../../middlewares/rest").APIError;

// 排行榜歌单详情
let top = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var topId = ctx.request.query.topId || '16';
        var limit = ctx.request.query.limit || '100';
        var offset = ctx.request.query.offset || '1';
        var from = ctx.request.query.from || 'web';
    } else if (ctx.request.method === 'POST') {
        var topId = ctx.request.body.topId || '16';
        var limit = ctx.request.body.limit || '100';
        var offset = ctx.request.body.offset || '1';
        var from = ctx.request.body.from || 'web';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    if (from === 'pc') {
        // 理论上讲访问速度更加快
        var result = await kuwo_request(`http://kbangserver.kuwo.cn/ksong.s?from=pc&fmt=json&pn=${parseInt(offset) - 1}&rn=${limit}&type=bang&data=content&id=${topId}&show_copyright_off=0&pcmp4=1&isbang=1`);
    } else {
        var result = await kuwo_request(`http://kuwo.cn/api/www/bang/bang/musicList`, {
            bangId: topId.trim(),
            pn: offset.trim(),
            rn: limit.trim(),
            httpsStatus: 1,
            reqId: '06a52ee0-9486-11ec-9372-9b980bbe276f'
        });
    }

    global.cache.set(ctx.request.url, result.data, 3600);

    ctx.rest(result.data);
    result = null;
}

// 排行榜分类
let topCategory = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var from = ctx.request.query.from || 'pc';
    } else if (ctx.request.method === 'POST') {
        var from = ctx.request.body.from || 'pc';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }
    
    if (from === 'pc') {
        var result = await kuwo_request('http://m.kuwo.cn/newh5app/api/mobile/v1/typelist/rank', null, 0);
    } else if (from === 'web') {
        var result = await kuwo_request('http://kuwo.cn/api/www/bang/bang/bangMenu', {
            httpsStatus: 1,
            reqId: '06a52ee0-9486-11ec-9372-9b980bbe276f'
        });
    }

    global.cache.set(ctx.request.url, result.data, 3600);

    ctx.rest(result.data);
    result = null;
    from = null;
}

module.exports = {
    top,
    topCategory
}