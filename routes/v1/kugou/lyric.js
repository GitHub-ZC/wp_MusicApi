const { kugou_request } = require("../../../util/kugou_request");
const APIError = require("../../../middlewares/rest").APIError;


let lyric = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var aid = ctx.request.query.rid || '80488731';
    } else if (ctx.request.method === 'POST') {
        var aid = ctx.request.body.rid || '80488731';
    }

    let result = await kugou_request(`http://lyrics.kugou.com/download?ver=1&client=pc&id=${aid}&accesskey=${accessKey}&fmt=krc&charset=utf8`);
    
    ctx.rest(result.data);
}

module.exports = {
    lyric
}