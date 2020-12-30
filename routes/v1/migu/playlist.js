const { migu_request } = require("../../../util/migu_request");

// 歌手基本信息显示
let playList_info = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var playListId = ctx.request.query.playListId || '179730639';
        var limit = ctx.request.query.limit || '30';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var playListId = ctx.request.query.playListId || '179730639';
        var limit = ctx.request.body.limit || '30';
    }

    let result = await migu_request(`https://m.music.migu.cn/migu/remoting/playlistcontents_query_tag`, {
        playListType: 2,
        playListId: playListId,
        contentCount: limit
    });
    
    try {
        ctx.body = JSON.stringify(result.data);
    } catch (error) {
        ctx.body = JSON.stringify({
            error: '服务端数据解析错误',
            status: 400
        })
    }
    ctx.type = 'application/json';
}


module.exports = {
    playList_info
}