const { kuwo_request } = require("../../../util/kuwo_request");
const APIError = require("../../../middlewares/rest").APIError;

// 排行榜歌单详情
let top = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var topId = ctx.request.query.topId || '16';
        var limit = ctx.request.query.limit || '30';
        var offset = ctx.request.query.offset || '1';
    } else if (ctx.request.method === 'POST') {
        var topId = ctx.request.body.topId || '16';
        var limit = ctx.request.body.limit || '30';
        var offset = ctx.request.body.offset || '1';
    }

    let result = await kuwo_request(`http://kuwo.cn/api/www/bang/bang/musicList`, {
        bangId: topId.trim(),
        pn: offset.trim(),
        rn: limit.trim(),
        httpsStatus: 1,
        reqId: '69aea0f0-4b6e-11eb-96b8-45ff05ac6a0e'
    });
    ctx.rest(result.data);
}

// 排行榜分类
let topCategory = async (ctx) => {
    let result = await kuwo_request('http://kuwo.cn/api/www/bang/bang/bangMenu', {
        httpsStatus: 1,
        reqId: '61352da0-4c03-11eb-b0b7-8b03aa7e4b0d'
    })

    ctx.rest(result.data);
}

module.exports = {
    top,
    topCategory
}