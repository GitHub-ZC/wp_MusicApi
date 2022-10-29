const { default: axios } = require("axios");
const APIError = require("../../../middlewares/rest").APIError;
// 第三方加密库
const encrypt = require('../../../util/crypto');
const crypto = require('crypto');
const { serialization } = require('../../../util/cookie_util');
const qs = require('qs');


let comment = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var id = ctx.request.query.id || '';
        var offset = ctx.request.query.offset || '1';
        var limit = ctx.request.query.limit || '30';
        var type = ctx.request.query.type || '0';
        var sortType = ctx.request.query.sortType || '1';
        var cursor = ctx.request.query.cursor || '0';
    } else if (ctx.request.method === 'POST') {
        var id = ctx.request.body.id || '';
        var offset = ctx.request.body.offset || '1';
        var limit = ctx.request.body.limit || '30';
        var type = ctx.request.body.type || '0';
        var sortType = ctx.request.body.sortType || '1';
        var cursor = ctx.request.body.cursor || '0';
    }


    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
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

    type = config.resourceTypeMap[type]
    const threadId = type + id
    sortType = Number(sortType) || 99
    if (sortType === 1) {
        sortType = 99
    }
    let cursor_ = ''
    switch (sortType) {
        case 99:
            cursor_ = (offset - 1) * limit
            break
        case 2:
            cursor_ = 'normalHot#' + (offset - 1) * limit
            break
        case 3:
            cursor_ = cursor || '0'
            break
        default:
            break
    }
    let data = {
        threadId: threadId,
        offset: offset.trim(),
        showInner: ctx.request.query.showInner || true,
        pageSize: limit.trim(),
        cursor: cursor_,
        sortType: sortType, //99:按推荐排序,2:按热度排序,3:按时间排序
    }

    let options = {
        cookie: { ...global.wy_cookie, os: 'pc' },
        proxy: undefined,
        realIP: undefined,
        url: '/api/v2/resource/comments',
        ip: '::1'
    }


    let url = `https://music.163.com/eapi/v2/resource/comments`;

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

    data.header = header
    data = encrypt.eapi(options.url, data)
    url = url.replace(/\w*api/, 'eapi')

    let result = await axios.post(url, new URLSearchParams(data).toString(), {
        headers
    })


    global.cache.set(ctx.request.url, result ? result.data : {});

    ctx.rest(result ? result.data : {});
}






let comment_hot = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var id = ctx.request.query.id || '';
        var offset = ctx.request.query.offset || '1';
        var limit = ctx.request.query.limit || '30';
        var type = ctx.request.query.type || '0';
        var before = ctx.request.query.before || '0';
    } else if (ctx.request.method === 'POST') {
        var id = ctx.request.body.id || '';
        var offset = ctx.request.body.offset || '1';
        var limit = ctx.request.body.limit || '30';
        var type = ctx.request.body.type || '0';
        var before = ctx.request.body.before || '0';
    }


    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }


    let resourceTypeMap = {
        "0": "R_SO_4_",
        "1": "R_MV_5_",
        "2": "A_PL_0_",
        "3": "R_AL_3_",
        "4": "A_DJ_1_",
        "5": "R_VI_62_",
        "6": "A_EV_2_",
        "7": "A_DR_14_"
    }



    type = resourceTypeMap[type]
    let data = {
        rid: id,
        limit: parseInt(limit),
        offset: (parseInt(offset) -1) * parseInt(limit),
        beforeTime: before,
    }

    let csrfToken = (serialization(global.wy_cookie) || '').match(/_csrf=([^(;|$)]+)/);
    data.csrf_token = csrfToken ? csrfToken[1] : '';
    data = encrypt.weapi(data);


    let result = await axios.post(`https://music.163.com/weapi/v1/resource/hotcomments/${type}${id}`, qs.stringify(data), {
        headers: {
            "User-Agent": 'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BKK-AL10 Build/HONORBKK-AL10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/10.6 Mobile Safari/537.36',
            Referer: 'https://music.163.com',
            cookie: serialization(global.wy_cookie)
        }
    });

    global.cache.set(ctx.request.url, result ? result.data : {});

    ctx.rest(result ? result.data : {});
}







module.exports = {
    comment,
    comment_hot
}