const APIError = require("../../../middlewares/rest").APIError;
const { default: axios } = require("axios");
const { s } = require("../../../util/sssss");
var Qs = require("qs");
const cookie_util = require("../../../util/cookie_util");
const encrypt = require('../../../util/crypto');
const crypto = require('crypto');

let song = async (ctx) => {

    if (ctx.request.method === 'GET') {
        var id = ctx.request.query.id || '1463165983';
        var br = ctx.request.query.br || 'standard';
        var cookie = ctx.request.query.cookie || '__null__';
    } else if (ctx.request.method === 'POST') {
        var id = ctx.request.body.id || '1463165983';
        var br = ctx.request.body.br || 'standard';
        var cookie = ctx.request.body.cookie || '__null__';
    }


    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    // "ids": "[167655, 353066]"
    let result = await axios.post(`https://music.163.com/weapi/song/enhance/player/url/v1?csrf_token=`, Qs.stringify(s(id, br)), {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            Referer: 'https://music.163.com/',
            Host: 'music.163.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            Origin: 'https://music.163.com',
            Cookie: cookie !== '__null__' ? cookie : cookie_util.serialization(global.wy_cookie)
        }
    })



    global.cache.set(ctx.request.url, [result.data]);


    ctx.rest([result.data]);
    // ctx.rest(result.data);
    result = null;
}





let songUrl = async (ctx) => {

    // standard => 标准,higher => 较高, exhigh=>极高, lossless=>无损, hires=>Hi-Res
    if (ctx.request.method === 'GET') {
        var id = ctx.request.query.id || '33894312';
        var br = ctx.request.query.br || 'higher';
    } else if (ctx.request.method === 'POST') {
        var id = ctx.request.body.id || '33894312';
        var br = ctx.request.body.br || 'higher';
    }


    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let options = {
        // cookie: {
        //     Hm_lvt_5a6e11912baefa3612b9ca9e2f7f2b33: '1641289405',
        //     NMTID: '00OPbWFr9FuCfpiwEn-tXTxQ1P2ZyAAAAGDiZLQ1A',
        //     os: 'pc'
        // },
        cookie: {...global.wy_cookie, os: 'pc'},
        proxy: undefined,
        realIP: undefined,
        url: '/api/song/enhance/player/url/v1',
        ip: '::1'
    }


    let config = {
        "anonymous_token": "bf8bfeabb1aa84f9c8c3906c04a04fb864322804c83f5d607e91a04eae463c9436bd1a17ec353cf780b396507a3f7464e8a60f4bbc019437993166e004087dd32d1490298caf655c2353e58daa0bc13cc7d5c198250968580b12c1b8817e3f5c807e650dd04abd3fb8130b7ae43fcc5b",
        "resourceTypeMap": {
            "0": "R_SO_4_",
            "1": "R_MV_5_",
            "2": "A_PL_0_",
            "3": "R_AL_3_",
            "4": "A_DJ_1_",
            "5": "R_VI_62_",
            "6": "A_EV_2_",
            "7": "A_DR_14_"
        }
    }

    let url = `https://interface.music.163.com/eapi/song/enhance/player/url/v1`;
    // let data = { ids: '[33894312]', level: 'standard', encodeType: 'flac' };
    let data = {
        ids: '[' + id.trim() + ']',
        level: br.trim(),
        encodeType: 'flac',
    }

    let headers = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:80.0) Gecko/20100101 Firefox/80.0' }

    headers['Content-Type'] = 'application/x-www-form-urlencoded'


    headers['Referer'] = 'https://music.163.com'

    let ip = options.realIP || options.ip || ''
    // console.log(ip)
    if (ip) {
        headers['X-Real-IP'] = ip
        headers['X-Forwarded-For'] = ip
    }
    // headers['X-Real-IP'] = '118.88.88.88'
    if (typeof options.cookie === 'object') {
        options.cookie = {
            ...options.cookie,
            __remember_me: true,
            NMTID: crypto.randomBytes(16).toString('hex'),
            _ntes_nuid: crypto.randomBytes(16).toString('hex'),
        }
        if (!options.cookie.MUSIC_U) {
            // 游客
            if (!options.cookie.MUSIC_A) {
                options.cookie.MUSIC_A = config.anonymous_token
            }
        }
        headers['Cookie'] = Object.keys(options.cookie)
            .map(
                (key) =>
                    encodeURIComponent(key) +
                    '=' +
                    encodeURIComponent(options.cookie[key]),
            )
            .join('; ')
    } else if (options.cookie) {
        headers['Cookie'] = options.cookie
    } else {
        headers['Cookie'] = '__remember_me=true; NMTID=xxx'
    }


    const cookie = options.cookie || {}
    const csrfToken = cookie['__csrf'] || ''
    const header = {
        osver: cookie.osver, //系统版本
        deviceId: cookie.deviceId, //encrypt.base64.encode(imei + '\t02:00:00:00:00:00\t5106025eb79a5247\t70ffbaac7')
        appver: cookie.appver || '8.7.01', // app版本
        versioncode: cookie.versioncode || '140', //版本号
        mobilename: cookie.mobilename, //设备model
        buildver: cookie.buildver || Date.now().toString().substr(0, 10),
        resolution: cookie.resolution || '1920x1080', //设备分辨率
        __csrf: csrfToken,
        os: cookie.os || 'android',
        channel: cookie.channel,
        requestId: `${Date.now()}_${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(4, '0')}`,
    }
    if (cookie.MUSIC_U) header['MUSIC_U'] = cookie.MUSIC_U
    if (cookie.MUSIC_A) header['MUSIC_A'] = cookie.MUSIC_A
    // headers['Cookie'] = Object.keys(header)
    //     .map(
    //         (key) =>
    //             encodeURIComponent(key) + '=' + encodeURIComponent(header[key]),
    //     )
    //     .join('; ')

    // console.log('+++++++++++++++++++++++++data1', data);
    data.header = header
    // console.log('+++++++++++++++++++++++++data2', data);
    data = encrypt.eapi(options.url, data)
    url = url.replace(/\w*api/, 'eapi')
    // console.log('+++++++++++++++++++++++++data3', data);
    // console.log('+++++++++++++++++++++++++url', url);
    // console.log('+++++++++++++++++++++++++headers', headers);


    let result = await axios.post(url, new URLSearchParams(data).toString(), {
        headers
    })


    global.cache.set(ctx.request.url, [result.data]);


    ctx.rest([result.data]);
    // ctx.rest(result.data);
    result = null;
}






// let songInfo = async (ctx) => {

//     if (ctx.request.method === 'GET') {
//         var rid = ctx.request.query.rid || '156483846';
//     } else if (ctx.request.method === 'POST') {
//         var rid = ctx.request.body.rid || '156483846';
//     }

//     let result = await qq_request('http://kuwo.cn/api/www/music/musicInfo', {
//         mid: rid.trim(),
//         httpsStatus: 1,
//         reqId: 'e3f36a20-4c05-11eb-b0b7-8b03aa7e4b0d'
//     });

//     ctx.rest(result.data);
// }

module.exports = {
    song,
    songUrl
    // songInfo
}