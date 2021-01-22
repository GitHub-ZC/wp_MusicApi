const { kugou_request } = require("../../../util/kugou_request");
const APIError = require("../../../middlewares/rest").APIError;


let song = async (ctx) => {

    if (ctx.request.method === 'GET') {
        var aid = ctx.request.query.aid || '966846';
        var hash = ctx.request.query.hash || '03571660BC0BD02FAA5994E19F97A005';
        // var br = ctx.request.query.br || '320';
    } else if (ctx.request.method === 'POST') {
        var aid = ctx.request.body.aid || '966846';
        var hash = ctx.request.body.hash || '03571660BC0BD02FAA5994E19F97A005';
        // var br = ctx.request.body.br || '320';
    }


    let result = await kugou_request('https://wwwapi.kugou.com/yy/index.php', {
        r: 'play/getdata',
        hash: hash.trim(),
        dfid: '3vveN23r9XmR12T2CT2fRRjo',
        mid: 'b1125ac375a62cc3c87af9fdb1b16e14',
        platid: 4,
        album_id: aid.trim(),
        _: 1609553491401
    })
    // console.log(result);
    // 捕获序列化json出错，防止程序异常退出
    if (result.data === 'failed') {
        throw new APIError("Song:url_notfound", "Song url is not found")
    }
    
    ctx.rest(result.data);
}


// let songInfo = async (ctx) => {

//     if (ctx.request.method === 'GET') {
//         var rid = ctx.request.query.rid || '156483846';
//     } else if (ctx.request.method === 'POST') {
//         var rid = ctx.request.body.rid || '156483846';
//     }

//     let result = await kuwo_request('http://kuwo.cn/api/www/music/musicInfo', {
//         mid: rid.trim(),
//         httpsStatus: 1,
//         reqId: 'e3f36a20-4c05-11eb-b0b7-8b03aa7e4b0d'
//     });

//     ctx.rest(result.data);
// }

module.exports = {
    song
    // songInfo
}