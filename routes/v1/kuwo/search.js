const { kuwo_request } = require("../../../util/kuwo_request");
const APIError = require("../../../middlewares/rest").APIError;


let search = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var key = ctx.request.query.key || '';
        var limit = ctx.request.query.limit || '30';
        var offset = ctx.request.query.offset || '1';
        // var type = ctx.request.query.type || '2';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var key = ctx.request.body.key || '';
        var limit = ctx.request.body.limit || '30';
        var offset = ctx.request.body.offset || '1';
        // var type = ctx.request.body.type || '2';
    }

    let result = await kuwo_request("http://kuwo.cn/api/www/search/searchMusicBykeyWord", {
        key: key,
        pn: offset.trim(),
        rn: limit.trim(),
        httpsStatus: 1,
        reqId: '69aea0f0-4b6e-11eb-96b8-45ff05ac6a0e'
    });

    // 捕捉服务端解析错误，防止程序退出
    ctx.rest(result.data);

}

// 热搜
let hotSearch = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var from = ctx.request.query.from || 'pc';
    } else if (ctx.request.method === 'POST') {
        var from = ctx.request.body.from || 'pc';
    }

    if (from === 'pc') {
        var result = await kuwo_request('http://m.kuwo.cn/newh5app/api/mobile/v1/search/hotword');
    } else if (from === 'web') {
        var result = await kuwo_request('http://kuwo.cn/api/www/search/searchKey', {
            key: '',
            httpsStatus: 1,
            reqId: '28ef41b0-4c08-11eb-8015-69f0ef982187'
        });
    }

    ctx.rest(result.data);
}

let suggestSearch = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var key = ctx.request.query.key || '';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var key = ctx.request.body.key || '';
    }

    let result = await kuwo_request('http://kuwo.cn/api/www/search/searchKey', {
        key: key.trim(),
        httpsStatus: 1,
        reqId: '28ef41b0-4c08-11eb-8015-69f0ef982187'
    });
    ctx.rest(result.data);

}

module.exports = {
    search,
    hotSearch,
    suggestSearch
}