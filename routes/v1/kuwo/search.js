const { kuwo_request } = require("../../../util/kuwo_request");
const APIError = require("../../../middlewares/rest").APIError;


let search = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var key = ctx.request.query.key || '';
        var limit = ctx.request.query.limit || '30';
        var offset = ctx.request.query.offset || '1';
        var from = ctx.request.query.from || 'web';
        // var type = ctx.request.query.type || '2';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var key = ctx.request.body.key || '';
        var limit = ctx.request.body.limit || '30';
        var offset = ctx.request.body.offset || '1';
        var from = ctx.request.body.from || 'web';
        // var type = ctx.request.body.type || '2';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    if (from === 'pc') {
        var result = await kuwo_request(`http://search.kuwo.cn/r.s?user=351564826140493&android_id=fa8c43e5884bf6d6&prod=kwplayer_ar_9.3.7.5&corp=kuwo&newver=2&vipver=9.3.7.5&source=kwplayer_ar_9.3.7.5_pcguanwangmobile.apk&p2p=1&loginUid=0&loginSid=0&notrace=0&client=kt&all=${encodeURI(key)}&pn=${parseInt(offset.trim())-1}&rn=${limit.trim()}&uid=1904267592&ver=kwplayer_ar_9.3.7.5&vipver=1&show_copyright_off=1&newver=2&correct=1&ft=music&cluster=0&strategy=2012&encoding=utf8&rformat=json&vermerge=1&mobi=1&searchapi=2&issubtitle=1&province=&city=&latitude=&longtitude=&userIP=120.242.190.218&spPrivilege=1`)
    } else {
        var result = await kuwo_request("http://kuwo.cn/api/www/search/searchMusicBykeyWord", {
            key: key,
            pn: offset.trim(),
            rn: limit.trim(),
            httpsStatus: 1,
            reqId: 'fe4ca711-9317-11ec-b143-115a6c5b31c8'
        });
    }

    global.cache.set(ctx.request.url, result.data);

    // 捕捉服务端解析错误，防止程序退出
    ctx.rest(result.data);
    result = null;
}

// 热搜
let hotSearch = async (ctx) => {
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
        var result = await kuwo_request('http://m.kuwo.cn/newh5app/api/mobile/v1/search/hotword', null, 0);
    } else if (from === 'web') {
        var result = await kuwo_request('https://www.kuwo.cn/api/www/search/searchKey', {
            // key: '',
            // httpsStatus: 1,
            // reqId: '4d1b4040-cc34-11ec-9383-858d169c5de7'
        });
    }

    global.cache.set(ctx.request.url, result.data);
    
    ctx.rest(result.data);
    result = null;
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
        reqId: '06a52ee0-9486-11ec-9372-9b980bbe276f'
    });
    ctx.rest(result.data);
    result = null;
}

module.exports = {
    search,
    hotSearch,
    suggestSearch
}