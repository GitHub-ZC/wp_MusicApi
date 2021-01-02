const { kugou_request } = require("../../../util/kugou_request");
const APIError = require("../../../middlewares/rest").APIError;

// kugou music search api
// 可用的 search api
// https://songsearch.kugou.com/song_search_v2?callback=jQuery112409090559630919017_1585358668138&keyword=%E8%AE%B8%E5%B5%A9&page=1&pagesize=30&userid=-1&clientver=&platform=WebFilter&tag=em&filter=2&iscorrection=1&privilege_filter=0&_=1585358668140
// http://mobilecdn.kugou.com/api/v3/search/song?keyword=%E8%AE%B8%E5%B5%A9&page=1&pagesize=30
let search = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var key = ctx.request.query.key || '';
        var limit = ctx.request.query.limit || '30';
        var offset = ctx.request.query.offset || '1';
        var type = ctx.request.query.type || '2';
    } else if (ctx.request.method === 'POST') {
        var key = ctx.request.body.key || '';
        var limit = ctx.request.body.limit || '30';
        var offset = ctx.request.body.offset || '1';
        var type = ctx.request.body.type || '2';
    }

    let result = await kugou_request("http://ioscdn.kugou.com/api/v3/search/song", {
        keyword: key,
        page: offset.trim(),
        pagesize: limit.trim(),
        showtype: 10,
        plat: 2,
        version: 7910,
        tag: 1,
        correct: 1,
        privilege: 1,
        sver: 5
    });

    // 捕捉服务端解析错误，防止程序退出
    ctx.rest(result.data);

}

// 热搜
let hotSearch = async (ctx) => {
    let result = await kugou_request('https://searchrecommend.kugou.com/v1/word_nofocus', {
        platform: 'pc',
        _: 1609509985634
    });
    ctx.rest(result.data);

}

let suggestSearch = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var key = ctx.request.query.key || '';
    } else if (ctx.request.method === 'POST') {
        var key = ctx.request.body.key || '';
    }

    let result = await kugou_request('https://searchtip.kugou.com/getSearchTip', {
        keyword: key.trim(),
        MusicTipCount: 5,
        MVTipCount: 2,
        albumcount: 2,
        _: 1609506029431
    });
    ctx.rest(result.data);
    
}

module.exports = {
    search,
    hotSearch,
    suggestSearch
}