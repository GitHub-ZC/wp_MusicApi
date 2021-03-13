const { qq_request } = require("../../../util/qq_request");
const APIError = require("../../../middlewares/rest").APIError;


let playlist_Info = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var pid = ctx.request.query.pid || '';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var pid = ctx.request.body.pid || '';
    }

    if (pid.length === 0) {
        throw new APIError("QQ_playlist", "pid not found");
    }

    let result = await qq_request(`http://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg`, {
        type: 1,
        utf8: 1,
        disstid: pid.trim(), // 歌单的id
        loginUin: 0,
        format: 'json'
    });
    
    ctx.rest(result.data);
}

module.exports = {
    playlist_Info
}