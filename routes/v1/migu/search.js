const { migu_request } = require("../../../util/migu_request");
const APIError = require("../../../middlewares/rest").APIError;


// 关键字搜索（type：歌曲 2  歌手：1  专辑： 4 歌单：6  ​MV：5 ​ 歌词：7）
let search = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var key = ctx.request.query.key || '';
        var limit = ctx.request.query.limit || '30';
        var offset = ctx.request.query.offset || '1';
        var type = ctx.request.query.type || '2';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var key = ctx.request.body.key || '';
        var limit = ctx.request.body.limit || '30';
        var offset = ctx.request.body.offset || '1';
        var type = ctx.request.body.type || '2';
    }

    // url = `https://m.music.migu.cn/migu/remoting/scr_search_tag?rows=${limit}&type=${type}&keyword=${key}&pgc=${offset}`;
    let result = await migu_request('https://m.music.migu.cn/migu/remoting/scr_search_tag', {
        rows: limit.trim(),
        type: type.trim(),
        keyword: key,
        pgc: offset.trim()
    });

    // 捕捉服务端解析错误，防止程序退出
    ctx.rest(result.data);
    result = null;

    // try {
    //     ctx.body = JSON.stringify(result.data);
    // } catch (error) {
    //     ctx.body = JSON.stringify({
    //         error: '服务端数据解析错误',
    //         status: 400
    //     })
    // }
    // ctx.type = 'application/json';
}

// 热搜
let hotSearch = async (ctx) => {
    let result = await migu_request('https://music.migu.cn/v3/api/search/hotwords');
    ctx.rest(result.data);
    // try {
    //     ctx.body = JSON.stringify(result.data);
    // } catch (error) {
    //     ctx.body = JSON.stringify({
    //         error: '服务端数据解析错误',
    //         status: 400
    //     })
    // }
    // ctx.type = 'application/json';
}

let suggestSearch = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var key = ctx.request.query.key || '';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var key = ctx.request.body.key || '';
    }

    let result = await migu_request(`https://m.music.migu.cn/migu/remoting/autocomplete_tag`, {
        keyword: key
    });

    ctx.rest(result.data);
    // try {
    //     ctx.body = JSON.stringify(result.data);
    // } catch (error) {
    //     ctx.body = JSON.stringify({
    //         error: '服务端数据解析错误',
    //         status: 400
    //     })
    // }
    // ctx.type = 'application/json';
}

module.exports = {
    search,
    hotSearch,
    suggestSearch
}