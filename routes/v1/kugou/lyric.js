const { kugou_request } = require("../../../util/kugou_request");
const APIError = require("../../../middlewares/rest").APIError;


let lyric = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var rid = ctx.request.query.rid || '80488731';
    } else if (ctx.request.method === 'POST') {
        var rid = ctx.request.body.rid || '80488731';
    }

    let result = await kugou_request(`http://lyrics.kugou.com/download?ver=1&client=pc&id=${id}&accesskey=${accessKey}&fmt=krc&charset=utf8`, {
        musicId: rid.trim(),
        reqId: '69aea0f0-4b6e-11eb-96b8-45ff05ac6a0e'
    });
    
    ctx.rest(result.data);
}

module.exports = {
    lyric
}