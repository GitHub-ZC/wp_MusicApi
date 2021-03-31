const { kuwo_request } = require("../../../util/kuwo_request");
const APIError = require("../../../middlewares/rest").APIError;
const axios = require('axios');

const { decodeKwLyric } = require('../../../util/decodeLyric');

let lyric = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var rid = ctx.request.query.rid || '80488731';
        var from = ctx.request.query.from || 'pc';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var rid = ctx.request.body.rid || '80488731';
        var from = ctx.request.body.from || 'pc';
    }

    if (from === 'pc') {
        let lyric_str = await getLyric(rid);
        if (lyric_str === 'lyric not found') {
            throw new APIError('KuwoLyric', lyric_str);
        }
        ctx.rest({
            lyric_str
        });
    } else {
        var result = await kuwo_request(`http://m.kuwo.cn/newh5/singles/songinfoandlrc`, {
            musicId: rid.trim(),
            reqId: '69aea0f0-4b6e-11eb-96b8-45ff05ac6a0e'
        });
        ctx.rest(result.data);
    }
}

let getLyric = async (rid, isGetLyricx = false) => {
    let res = await axios.get(`http://player.kuwo.cn/webmusic/st/getNewMuiseByRid?rid=MUSIC_${rid.trim()}`);
    let info = parseLyricInfo(res.data);

    if (!info) {
        return 'lyric not found';
    }

    let lyric = await axios.get(`http://newlyric.kuwo.cn/newlyric.lrc?${isGetLyricx ? info.lyric_zz : info.lyric}`, {
        responseType: 'arraybuffer'
    });

    let base64Data = await decodeKwLyric({ lrcBase64: lyric.data.toString('base64'), isGetLyricx });
    return Buffer.from(base64Data, 'base64').toString();
}

parseLyricInfo = (str) => {
    let lrcInfoRxp = /<lyric>(.+?)<\/lyric>[\s\S]+<lyric_zz>(.+?)<\/lyric_zz>/;
    let result = str.match(lrcInfoRxp);
    return result ? { lyric: result[1], lyric_zz: result[2] } : null
}

module.exports = {
    lyric
}