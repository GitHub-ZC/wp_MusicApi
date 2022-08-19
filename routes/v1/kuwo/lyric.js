const { kuwo_request } = require("../../../util/kuwo_request");
const APIError = require("../../../middlewares/rest").APIError;
const axios = require('axios');

const { decodeKwLyric } = require('../../../util/decodeLyric');

const decodeName = (str = '') => str ? str.replace(/(?:&amp;|&lt;|&gt;|&quot;|&apos;|&#039;)/gm, s => encodeNames[s]) : '';

let lyric = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var rid = ctx.request.query.rid || '80488731';
        var from = ctx.request.query.from || 'pc';
    } else if (ctx.request.method === 'POST') {
        var rid = ctx.request.body.rid || '80488731';
        var from = ctx.request.body.from || 'pc';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    if (from === 'pc') {
        let lyric_str = await axios.get(`http://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${rid.trim()}`);
        
        if (!lyric_str.data.data.lrclist.length) throw new APIError('KuwoLyric', 'Get lyric failed');
        
        let lrcInfo
        try {
            lrcInfo = sortLrcArr(lyric_str.data.data.lrclist)
        } catch {
            throw new APIError('KuwoLyric', 'Get lyric failed');
        }

        global.cache.set(ctx.request.url, {
            lyric_str: decodeName(transformLrc(lyric_str.data.data.songinfo, lrcInfo.lrc)),
            tlyric: lrcInfo.lrcT.length ? decodeName(transformLrc(lyric_str.data.data.songinfo, lrcInfo.lrcT)) : ''
        });


        ctx.rest({
            lyric_str: decodeName(transformLrc(lyric_str.data.data.songinfo, lrcInfo.lrc)),
            tlyric: lrcInfo.lrcT.length ? decodeName(transformLrc(lyric_str.data.data.songinfo, lrcInfo.lrcT)) : ''
        });
    } else {
        var result = await kuwo_request(`http://m.kuwo.cn/newh5/singles/songinfoandlrc`, {
            musicId: rid.trim(),
            reqId: 'f8081460-9318-11ec-b5ec-39270da8c956'
        });

        global.cache.set(ctx.request.url, result.data);

        ctx.rest(result.data);
    }
}

let transformLrc = (songinfo, lrclist) => {
    return `[ti:${songinfo.songName}]\n[ar:${songinfo.artist}]\n[al:${songinfo.album}]\n[by:]\n[offset:0]\n${lrclist ? lrclist.map(l => `[${formatTime(l.time)}]${l.lineLyric}\n`).join('') : '暂无歌词'}`
}

let formatTime = (time) => {
    let m = parseInt(time / 60)
    let s = (time % 60).toFixed(2)
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)
}

let sortLrcArr = (arr) => {
    const lrcSet = new Set()
    let lrc = []
    let lrcT = []

    for (const item of arr) {
        if (lrcSet.has(item.time)) {
            const tItem = lrc.pop()
            tItem.time = lrc[lrc.length - 1].time
            lrcT.push(tItem)
            lrc.push(item)
        } else {
            lrc.push(item)
            lrcSet.add(item.time)
        }
    }

    if (lrcT.length && lrc.length > lrcT.length) {
        const tItem = lrc.pop()
        tItem.time = lrc[lrc.length - 1].time
        lrcT.push(tItem)
    }

    return {
        lrc,
        lrcT,
    }
}

/*
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
            reqId: 'f8081460-9318-11ec-b5ec-39270da8c956'
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
*/

module.exports = {
    lyric
}