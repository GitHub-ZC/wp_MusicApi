// const { kugou_request } = require("../../../util/kugou_request");
const APIError = require("../../../middlewares/rest").APIError;
const axios = require('axios');


const { decodeKgLyric } = require('../../../util/decodeLyric');

const decodeName = (str = '') => str.replace(/(?:&amp;|&lt;|&gt;|&quot;|&apos;|&#039;)/gm, s => encodeNames[s])

const headExp = /^.*\[id:\$\w+\]\n/

const parseLyric = str => {
    str = str.replace(/\r/g, '')
    if (headExp.test(str)) str = str.replace(headExp, '')
    let trans = str.match(/\[language:([\w=\\/+]+)\]/)
    let lyric
    let tlyric
    if (trans) {
        str = str.replace(/\[language:[\w=\\/+]+\]\n/, '')
        let json = JSON.parse(Buffer.from(trans[1], 'base64').toString())
        for (const item of json.content) {
            if (item.type == 1) {
                tlyric = item.lyricContent
                break
            }
        }
    }
    let i = 0
    let rlyric = str.replace(/\[((\d+),\d+)\].*/g, str => {
        let result = str.match(/\[((\d+),\d+)\].*/)
        let time = parseInt(result[2])
        let ms = time % 1000
        time /= 1000
        let m = parseInt(time / 60).toString().padStart(2, '0')
        time %= 60
        let s = parseInt(time).toString().padStart(2, '0')
        time = `${m}:${s}.${ms}`
        if (tlyric) tlyric[i] = `[${time}]${tlyric[i++][0]}`
        return str.replace(result[1], time)
    })
    tlyric = tlyric ? tlyric.join('\n') : ''
    rlyric = rlyric.replace(/<(\d+,\d+),\d+>/g, '<$1>')
    rlyric = decodeName(rlyric)
    lyric = rlyric.replace(/<\d+,\d+>/g, '')
    tlyric = decodeName(tlyric)
    return {
        lyric,
        tlyric,
        rlyric,
    }
}

let searchLyric = async (hash, tryNum = 0) => {
    let result = await axios.get(`http://lyrics.kugou.com/search?ver=1&man=yes&client=pc&hash=${hash}`, {/* &keyword=${encodeURI(name)} */
        headers: {
            'KG-RC': 1,
            'KG-THash': 'expand_search_manager.cpp:852736169:451',
            'User-Agent': 'KuGou2012-9020-ExpandSearchManager',
        },
    });

    if (result.status !== 200) {
        if (tryNum > 3) throw new APIError('searchLyric', 'searchLyric is error');
        let result_ = await searchLyric(hash, ++tryNum);
        return result_
    }

    if (result.data.candidates.length) {
        let info = result.data.candidates[0]
        return { id: info.id, accessKey: info.accesskey }
    }
    return null;
}


let getLyricDownload = async (id, accessKey, tryNum = 0) => {
    let result = await axios.get(`http://lyrics.kugou.com/download?ver=1&client=pc&id=${id}&accesskey=${accessKey}&fmt=krc&charset=utf8`, {
        headers: {
            'KG-RC': 1,
            'KG-THash': 'expand_search_manager.cpp:852736169:451',
            'User-Agent': 'KuGou2012-9020-ExpandSearchManager',
        },
    })
    if (result.status !== 200) {
        if (tryNum > 3) throw new APIError('getLyric', 'getLyricDownload is error');
        let result_ = await searchLyric(hash, ++tryNum);
        return result_
    }

    return decodeKgLyric(result.data.content).then(result => parseLyric(result))
}

let getLyric = async (songInfo, tryNum = 0) => {
    let result = await searchLyric(songInfo.hash);

    if (!result) return { lyric: null, tlyric: null, rlyric: null }

    let requestObj = await getLyricDownload(result.id, result.accessKey)

    return requestObj
}

let lyric = async (ctx) => {
    if (ctx.request.method === 'GET') {
        // var name = ctx.request.query.name || '花海';
        var hash = ctx.request.query.hash || '2FF4014692AC079A9B8118966C891897';
    } else if (ctx.request.method === 'POST') {
        // var name = ctx.request.body.name || '花海';
        var hash = ctx.request.body.hash || '2FF4014692AC079A9B8118966C891897';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let result = await getLyric({ hash });

    global.cache.set(ctx.request.url, result);

    ctx.rest(result);
    result = null;
}

module.exports = {
    lyric
}