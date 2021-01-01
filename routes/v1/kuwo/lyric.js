const { kuwo_request } = require("../../../util/kuwo_request");
const APIError = require("../../../middlewares/rest").APIError;


let lyric = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var rid = ctx.request.query.rid || '80488731';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var rid = ctx.request.body.rid || '80488731';
    }

    let result = await kuwo_request(`http://m.kuwo.cn/newh5/singles/songinfoandlrc`, {
        musicId: rid.trim(),
        reqId: '69aea0f0-4b6e-11eb-96b8-45ff05ac6a0e'
    });
    
    ctx.rest(result.data);
}

module.exports = {
    lyric
}