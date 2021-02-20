const { qq_request } = require("../../../util/qq_request");
const APIError = require("../../../middlewares/rest").APIError;


// t: 0：单曲，2：歌单，3:用户 ,7：歌词，8：专辑，9：歌手，12：mv
let search = async (ctx) => {
    // 关键字搜索（t: 0：单曲，2：歌单，3:用户 ,7：歌词，8：专辑，9：歌手，12：mv）
    if (ctx.request.method === 'GET') {
        var key = ctx.request.query.key || '';
        var limit = ctx.request.query.limit || '30';
        var offset = ctx.request.query.offset || '1';
        var type = ctx.request.query.type || '0';
    } else if (ctx.request.method === 'POST') {
        var key = ctx.request.body.key || '';
        var limit = ctx.request.body.limit || '30';
        var offset = ctx.request.body.offset || '1';
        var type = ctx.request.body.type || '0';
    }

    let url = '';
    if (['0', '7', '8', '9', '12'].includes(type)) {
        url = `https://c.y.qq.com/soso/fcgi-bin/client_search_cp?t=${type.trim()}&cr=1&p=${offset.trim()}&n=${limit.trim()}&w=${encodeURI(key)}&format=json`;
    } else if (type === '2') {
        url = `https://c.y.qq.com/soso/fcgi-bin/client_music_search_songlist?remoteplace=txt.yqq.playlist&page_no=${parseInt(offset.trim())-1}&num_per_page=${limit.trim()}&query=${encodeURI(key)}&format=json`;
    } else if (type === '3') {
        url = `https://c.y.qq.com/soso/fcgi-bin/client_search_user?p=${offset.trim()}&n=${limit.trim()}&searchid=241014031194265199&remoteplace=txt.yqq.user&w=${encodeURI(key)}&format=json`;
    }

    let result = await qq_request(url);
    // console.log(__Cookie.parse(global.qq_cookie));

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

    if (from === 'web') {
        var result = (await qq_request('https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?format=json')).data;
    } else if (from === 'pc') {
        let html = await qq_request('https://i.y.qq.com/n2/m/index.html');

        let rule = /<script>window.__INIT_DATA__=(.*?)\<\/script>/;
        
        let arr = rule.exec(html.data);
        var result = JSON.parse(arr[1]).homeData.hotList;
    }
    ctx.rest(result);
    result = null;
}

// 搜索建议
let suggestSearch = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var key = ctx.request.query.key || '';
    } else if (ctx.request.method === 'POST') {
        var key = ctx.request.body.key || '';
    }

    let result = await qq_request(`https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?key=${encodeURI(key)}&format=json`);
    ctx.rest(result.data);
}

module.exports = {
    search,
    hotSearch,
    suggestSearch
}