const { default: axios } = require("axios");
const APIError = require("../../../middlewares/rest").APIError;
const qs = require('qs');
const encrypt = require('../../../util/crypto');
const { serialization, parse } = require("../../../util/cookie_util");
const crypto = require('crypto');

let login_refresh = async (ctx) => {
    if (ctx.request.method === 'GET') {

    } else if (ctx.request.method === 'POST') {

    }

    // const cacheData = global.cache.get(ctx.request.url);
    // if (cacheData) {
    //     ctx.rest(cacheData);
    //     return;
    // }

    let json_ = {};
    let csrfToken = (serialization(global.wy_cookie) || '').match(/_csrf=([^(;|$)]+)/);

    json_.csrf_token = csrfToken ? csrfToken[1] : '';


    let data = encrypt.weapi(json_);

    let result = await axios.post(`https://music.163.com/weapi/login/token/refresh `, new URLSearchParams(data).toString(), {
        headers: {
            "User-Agent": 'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BKK-AL10 Build/HONORBKK-AL10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/10.6 Mobile Safari/537.36',
            Referer: 'https://music.163.com',
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: serialization({ ...global.wy_cookie, _ntes_nuid: crypto.randomBytes(16).toString('hex'), NMTID: crypto.randomBytes(16).toString('hex') })
        }
    });


    let cookieArr = result.headers["set-cookie"].map(cookie => {
        return cookie.split("; ")[0];
    });

    cookieArr = cookieArr.filter(cookie => {
        if (cookie.split("=").pop() === "") {
            return false;
        }
        return true;
    })
    let cookieSet = new Set(cookieArr);
    cookieArr = [...cookieSet];

    result.data.cookie = cookieArr.join("; ");
    global.wy_cookie = { ...global.wy_cookie, ...parse(cookieArr.join("; ")) };

    // global.cache.set(ctx.request.url, {...result.data, cookie: result.headers['set-cookie'].join("; ")});

    ctx.rest(result.data);
}



let login = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var phone = ctx.request.query.phone || '';
        var countrycode = ctx.request.query.countrycode || '86';
        var captcha = ctx.request.query.captcha;
        var password = ctx.request.query.password || '';
    } else if (ctx.request.method === 'POST') {
        var phone = ctx.request.body.phone || '';
        var countrycode = ctx.request.body.countrycode || '86';
        var captcha = ctx.request.body.captcha;
        var password = ctx.request.body.password || '';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let csrfToken = (serialization({ ...global.wy_cookie, os: "ios", appver: '8.7.01' }) || '').match(/_csrf=([^(;|$)]+)/);

    csrf_token = csrfToken ? csrfToken[1] : '';

    let data = encrypt.weapi({
        phone: phone,
        captcha: captcha,
        countrycode: countrycode,
        password: crypto.createHash('md5').update(password).digest('hex'),
        rememberLogin: 'true',
        csrf_token: csrf_token
    });

    let result = await axios.post(`https://music.163.com/weapi/login/cellphone`, qs.stringify(data), {
        headers: {
            "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:80.0) Gecko/20100101 Firefox/80.0',
            Referer: 'https://music.163.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: serialization({ ...global.wy_cookie, os: "ios", appver: '8.7.01' })
        }
    });


    let cookieArr = result.headers["set-cookie"].map(cookie => {
        return cookie.split("; ")[0];
    });

    cookieArr = cookieArr.filter(cookie => {
        if (cookie.split("=").pop() === "") {
            return false;
        }
        return true;
    })

    let cookieSet = new Set(cookieArr);
    cookieArr = [...cookieSet];

    result.data.cookie = cookieArr.join("; ");
    global.wy_cookie = parse(cookieArr.join("; "));

    global.cache.set(ctx.request.url, result.data);

    ctx.rest(result.data);
}


module.exports = {
    login_refresh,
    login
}

//7b6c96634c9942dd9666f855411ac67e