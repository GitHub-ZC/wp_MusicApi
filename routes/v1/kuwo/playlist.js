const { default: axios } = require("axios");
const { kuwo_request } = require("../../../util/kuwo_request");
const APIError = require("../../../middlewares/rest").APIError;


// 歌单标签分类
let playlist_tagCategory = async (ctx) => {

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }
    
    let result = await kuwo_request(`http://kuwo.cn/api/www/playlist/getTagList`, {
        httpsStatus: 1,
        reqId: 'fe4ca711-9317-11ec-b143-115a6c5b31c8'
    });

    global.cache.set(ctx.request.url, result.data);

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

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    // 如果flag field value equal one ，不走 最新、最热 歌单分类 路由
    if (flag === '1') {
        var result = await kuwo_request(`http://kuwo.cn/api/pc/classify/playlist/getTagPlayList`, {
            pn: offset.trim(),
            rn: limit.trim(),
            id: id.trim(),
            httpsStatus: 1,
            reqId: 'fe4ca711-9317-11ec-b143-115a6c5b31c8'
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
            reqId: 'fe4ca711-9317-11ec-b143-115a6c5b31c8'
        })
    }
    
    global.cache.set(ctx.request.url, result.data);

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

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let result = await kuwo_request(`http://kuwo.cn/api/www/playlist/playListInfo`, {
        pid: pid.trim(),
        pn: offset.trim(),
        rn: limit.trim(),
        httpsStatus: 1,
        reqId: '71e2f370-4c22-11eb-af49-1156a1732ca7'
    });

    global.cache.set(ctx.request.url, result.data);

    ctx.rest(result.data)
}




//外部导入歌单 => 酷狗码（只支持500首） PC
let playlist_import = async (ctx) => {

    if (ctx.request.method === 'GET') {
        var id = ctx.request.query.id || '';
    } else if (ctx.request.method === 'POST') {
        var id = ctx.request.body.id || '';
    }

    if (id.trim() === '') {
        throw new APIError("Playlist:Error", "id is not found");
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }


    let result = await axios.get(`http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid=${id}&pn=0&rn=10000&encode=utf8&keyset=pl2012&identity=kuwo&pcmp4=1&vipver=MUSIC_9.0.5.0_W1&newver=1`);


    global.cache.set(ctx.request.url, result.data);

    ctx.rest(result.data);
}



module.exports = {
    playlist_tagCategory,
    playlist_Tag,
    playlist_Info,
    playlist_import
}