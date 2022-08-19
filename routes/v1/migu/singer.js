const { migu_request } = require("../../../util/migu_request");
const APIError = require("../../../middlewares/rest").APIError;


// 歌手基本信息显示
let singer_Info = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var artistId = ctx.request.query.artistId || '18196';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var artistId = ctx.request.body.artistId || '18196';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let result = await migu_request(`https://m.music.migu.cn/migu/remoting/cms_artist_detail_tag`, {
        artistId: artistId.trim()
    });

    global.cache.set(ctx.request.url, result.data);
    
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

// 歌手的相关歌曲显示
// 每一页数据都是 默认 20 首
let singer_songList = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var artistId = ctx.request.query.artistId || '112';
        var offset = ctx.request.query.offset || '1';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var artistId = ctx.request.query.artistId || '112';
        var offset = ctx.request.body.offset || '1';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let result = await migu_request(`https://music.migu.cn/v3/music/artist/${artistId.trim()}/song`, {
        page: offset.trim()
    });

    let re_str = /<div class="add-to-playlist J_AddToPlaylist">.*?data-aid="(.*?)".*?data-mids="(.*?)".*?data-cids="(.*?)".*?data-share='(.*?)'.*?<\/a>/gs;
    let re_total = /<span>全部歌曲（(.*?)）<\/span>/s;

    try {
        // ctx.body = JSON.stringify(result.data);
        let arr;
        let songList = [];
        while ((arr = re_str.exec(result.data)) !== null) {
            // console.log(arr[1], arr[2], arr[3], arr[4]);
            songList.push({
                albumId: arr[1],
                id: arr[2],
                copyrightId: arr[3],
                al: JSON.parse(arr[4])
            });
        }
        let _result = {
            status: 200,
            total: re_total.exec(result.data)[1],
            num: 20,
            songList: songList
        };

        global.cache.set(ctx.request.url, _result);

        ctx.body = JSON.stringify(_result);

        arr = null;
        _result = null;
        songList = null;
    } catch (error) {
        ctx.body = JSON.stringify({
            error: '服务端数据解析错误',
            status: 400
        })
    }
    ctx.type = 'application/json';
}

module.exports = {
    singer_Info,
    singer_songList
}