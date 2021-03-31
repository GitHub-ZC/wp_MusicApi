const APIError = require("../../../middlewares/rest").APIError;
const axios = require('axios');


let getPic = async (songInfo) => {

    if (ctx.request.method === 'GET') {
        // var name = ctx.request.query.name || '花海';
        var hash = ctx.request.query.hash || '2FF4014692AC079A9B8118966C891897';
        var songmid = ctx.request.query.songmid || '2FF4014692AC079A9B8118966C891897';
        var singer = ctx.request.query.songmid || '2FF4014692AC079A9B8118966C891897';
    } else if (ctx.request.method === 'POST') {
        // var name = ctx.request.body.name || '花海';
        var hash = ctx.request.body.hash || '2FF4014692AC079A9B8118966C891897';
        var songmid = ctx.request.body.songmid || '2FF4014692AC079A9B8118966C891897';
        var songmid = ctx.request.body.songmid || '2FF4014692AC079A9B8118966C891897';
    }

    const result = await axios.post(
        'http://media.store.kugou.com/v1/get_res_privilege',
        {
            method: 'POST',
            headers: {
                'KG-RC': 1,
                'KG-THash': 'expand_search_manager.cpp:852736169:451',
                'User-Agent': 'KuGou2012-9020-ExpandSearchManager',
            },
            body: {
                appid: 1001,
                area_code: '1',
                behavior: 'play',
                clientver: '9020',
                need_hash_offset: 1,
                relate: 1,
                resource: [
                    {
                        album_audio_id:
                            songInfo.songmid.length == 32 // 修复歌曲ID存储变更导致图片获取失败的问题
                                ? songInfo.audioId.split('_')[0]
                                : songInfo.songmid,
                        album_id: songInfo.albumId,
                        hash: songInfo.hash,
                        id: 0,
                        name: `${songInfo.singer} - ${songInfo.name}.mp3`,
                        type: 'audio',
                    },
                ],
                token: '',
                userid: 2626431536,
                vip: 1,
            },
        },
    )

    if (result.data.error_code !== 0) return Promise.reject('图片获取失败')
    let info = result.data.data[0].info
    const img = info.imgsize ? info.image.replace('{size}', info.imgsize[0]) : info.image
    if (!img) return Promise.reject('Pic get failed')
    return img

    return requestObj
}

module.exports = {
    getPic
}