// const { qq_request } = require("../../../util/qq_request");
const APIError = require("../../../middlewares/rest").APIError;

// 解析cookie
const __Cookie = require('../../../util/cookie_util');
const { login: QQlogin } = require('../../../util/p');
const { login_qq_scan, get_qrlogin_pic } = require('../../../util/login_qq_scan');
const { default: axios } = require("axios");

// Login QQ
let login = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var u = ctx.request.query.u || '';
        var p = ctx.request.query.p || '';
    } else if (ctx.request.method === 'POST') {
        var u = ctx.request.body.u || '';
        var p = ctx.request.body.p || '';
    }

    if (u.trim() == '' || p.trim() == '') {
        throw new APIError('Login:argument_notfound', 'argument data is not found');
    }

    let cookie = await QQlogin(u.trim(), p.trim());

    if (cookie !== "异地登陆，需要验证码，请在QQ手机关闭登录保护") {
        global.qq_cookie = __Cookie.parse(data);
    }

    ctx.rest({
        cookie
    });
}


// Login QQ
let login_scan = async (ctx) => {
    // if (ctx.request.method === 'GET') {
    //     var u = ctx.request.query.u || '';
    //     var p = ctx.request.query.p || '';
    // } else if (ctx.request.method === 'POST') {
    //     var u = ctx.request.body.u || '';
    //     var p = ctx.request.body.p || '';
    // }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        // 设置Content-Type:
        ctx.response.type = 'image/png';
        // 设置Response Body:
        ctx.response.body = cacheData;
        return;
    }

    let d = get_qrlogin_pic();
    let res = await axios.request({
        url: d,
        method: 'GET',
        responseType: 'arraybuffer'
    });
    // console.log(res.data);

    await login_qq_scan(res.headers['set-cookie']);


    global.cache.set(ctx.request.url, res.data, 50);

    // 设置Content-Type:
    ctx.response.type = 'image/png';
    // 设置Response Body:
    ctx.response.body = res.data;
}


module.exports = {
    login,
    login_scan
}