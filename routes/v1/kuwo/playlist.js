const { kuwo_request } = require("../../../util/kuwo_request");
const APIError = require("../../../middlewares/rest").APIError;


// 歌单标签分类
let playlist_tagCategory = async (ctx) => {

    let result = await kuwo_request(`http://kuwo.cn/api/www/playlist/getTagList`, {
        httpsStatus: 1,
        reqId: 'afe94031-4c17-11eb-aa45-b7fba8eecac4'
    });


    ctx.rest(result.data);
}

// 歌单标签下的歌单列表
let playlist_Tag = async (ctx) => {

    if (ctx.request.method === 'GET') {
        var id = ctx.request.query.id || '146';
        var flag = ctx.request.query.flag || '0';
        var order = ctx.request.query.order || 'hot';
        var limit = ctx.request.query.limit || '30';
        var offset = ctx.request.query.offset || '1';
    } else if (ctx.request.method === 'POST') {
        var id = ctx.request.body.id || '146';
        var flag = ctx.request.body.flag || '0';
        var order = ctx.request.body.order || 'hot';
        var limit = ctx.request.body.limit || '30';
        var offset = ctx.request.body.offset || '1';
    }

    // 如果flag field value equal one ，不走 最新、最热 歌单分类 路由
    if (flag === '1') {
        var result = await kuwo_request(`http://kuwo.cn/api/pc/classify/playlist/getTagPlayList`, {
            pn: offset.trim(),
            rn: limit.trim(),
            id: id.trim(),
            httpsStatus: 1,
            reqId: 'fe738170-4c1c-11eb-af49-1156a1732ca7'
        });
    } else {
        if (order.trim() !== 'new' && order.trim() !== 'hot') {
            throw new APIError("Playlist:order_error", "ardument order is error");
        }
        var result = await kuwo_request(`http://kuwo.cn/api/pc/classify/playlist/getRcmPlayList`, {
            pn: offset.trim(),
            rn: limit.trim(),
            order: order.trim(),
            httpsStatus: 1,
            reqId: '375c0740-4c1e-11eb-af49-1156a1732ca7'
        })
    }

    ctx.rest(result.data);
}


// 歌单的歌曲信息
let playlist_Info = async (ctx) => {

    if (ctx.request.method === 'GET') {
        var pid = ctx.request.query.pid || '3127794871';
        var limit = ctx.request.query.limit || '30';
        var offset = ctx.request.query.offset || '1';
    } else if (ctx.request.method === 'POST') {
        var pid = ctx.request.body.pid || '3127794871';
        var limit = ctx.request.body.limit || '30';
        var offset = ctx.request.body.offset || '1';
    }


    let result = await kuwo_request(`http://kuwo.cn/api/www/playlist/playListInfo`, {
        pid: pid.trim(),
        pn: offset.trim(),
        rn: limit.trim(),
        httpsStatus: 1,
        reqId: '71e2f370-4c22-11eb-af49-1156a1732ca7'
    });

    ctx.rest(result.data)
}

module.exports = {
    playlist_tagCategory,
    playlist_Tag,
    playlist_Info
}