const { qq_request } = require("../../../util/qq_request");
const APIError = require("../../../middlewares/rest").APIError;

// 排行榜歌单详情
let top = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var topId = ctx.request.query.topId || '26';
        var limit = ctx.request.query.limit || '200';
        var offset = ctx.request.query.offset || '1';
        var period = ctx.request.query.offset || '';
    } else if (ctx.request.method === 'POST') {
        var topId = ctx.request.body.topId || '26';
        var limit = ctx.request.body.limit || '200';
        var offset = ctx.request.body.offset || '1';
        var period = ctx.request.body.offset || '';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    if (period) {
        var url = `https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&data={"detail":{"module":"musicToplist.ToplistInfoServer","method":"GetDetail","param":{"topId":${topId.trim()},"offset":${(parseInt(offset)-1) * limit},"num":${limit.trim()},"period":"${period.trim()}"}},"comm":{"ct":24,"cv":0}}`;
    } else {
        var url = `https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&data={"detail":{"module":"musicToplist.ToplistInfoServer","method":"GetDetail","param":{"topId":${topId.trim()},"offset":${(parseInt(offset)-1) * limit},"num":${limit.trim()}}},"comm":{"ct":24,"cv":0}}`;
    }

    let result = await qq_request(url);


    global.cache.set(ctx.request.url, result.data, 3600);

    ctx.rest(result.data);
    result = null;
}

// 排行榜分类
let topCategory = async (ctx) => {
    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let result = await qq_request('https://u.y.qq.com/cgi-bin/musicu.fcg?_=1601389640007&data={"comm":{"g_tk":308189849,"uin":1528773794,"format":"json","inCharset":"utf-8","outCharset":"utf-8","notice":0,"platform":"h5","needNewCode":1,"ct":23,"cv":0},"topList":{"module":"musicToplist.ToplistInfoServer","method":"GetAll","param":{}}}');


    global.cache.set(ctx.request.url, result.data, 3600);

    ctx.rest(result.data);
    result = null;
}

module.exports = {
    top,
    topCategory
}