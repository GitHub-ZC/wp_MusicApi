const { kuwo_request } = require("../../../util/kuwo_request");
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
// let hotSearch = async (ctx) => {
//     let result = await kuwo_request('https://music.migu.cn/v3/api/search/hotwords');
//     ctx.rest(result.data);

// }

// let suggestSearch = async (ctx) => {
//     if (ctx.request.method === 'GET') {
//         var key = ctx.request.query.key || '';
//         // console.log(typeof ctx.request.query.limit, limit);
//     } else if (ctx.request.method === 'POST') {
//         var key = ctx.request.body.key || '';
//     }

//     let result = await kuwo_request(`https://m.music.migu.cn/migu/remoting/autocomplete_tag`, {
//         keyword: key
//     });

//     ctx.rest(result.data);
    
// }

module.exports = {
    search,
    // hotSearch,
    // suggestSearch
}