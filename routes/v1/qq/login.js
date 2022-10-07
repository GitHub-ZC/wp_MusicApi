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



// let login_scan_long = async (ctx) => {

//     if (ctx.request.method === 'GET') {
//         var u = ctx.request.query.u || '0';
//     } else if (ctx.request.method === 'POST') {
//         var u = ctx.request.body.u || '0';
//     }

//     const cacheData = global.cache.get('LKHKJAHKJGKADLKHAKFJAHKDJH');
//     if (cacheData) {
//         // 设置Content-Type:
//         ctx.response.type = 'image/png';
//         // 设置Response Body:
//         ctx.response.body = cacheData;
//         return;
//     }


//     // 清除上一次的定时器
//     if(global.clearTime) {
//         clearInterval(global.clearTime);
//     }

//     // 账号不能为空
//     if(u === '0') {
//         throw new APIError('login Error', '参数 u 不存在， u为账号');
//     }

//     const account = u;
//     const client = createClient(parseInt(account));

//     let data = null;

//     client.on("system.online", () => {
//         console.log("Logged in!");
//         global.qq_cookie = __Cookie.parse(client.cookies['v.qq.com'].toString('utf8'));

//         setTimeout(async () => {
//             console.log("Logout out!");
//             await client.logout();
//         }, 10000);
//     })

//     // client.on("system.login.qrcode", function (e) {
//     //     data = e;
//     // }).login();

//     let a = await client.fetchQrcode_1();
//     console.log(a);
//     if(a.status === 200) {
//         data = a.data
//     }

//     if(a.status === 400) {
//         throw new APIError('login Error', '获取二维码失败,服务器内部错误');
//     }

//     try {
//         global.clearTime = setInterval(async () => {
//             let result = await client.queryQrcodeResult();
//             console.log(result);

//             if (result.retcode === 0) {
//                 let a = await client.qrcodeLogin();
//                 console.log(a);
//                 clearInterval(global.clearTime);
//             }

//             // 二维码失效
//             if (result.retcode === 17) {
//                 clearInterval(global.clearTime);
//             }

//             // 二维码认证中
//             if (result.retcode === 53) {
//                 // client.login();
//             }

//             // 二维码认证被拒
//             if (result.retcode === 54) {
//                 clearInterval(global.clearTime);
//             }

//         }, 2000);
//     } catch (error) {
//         clearInterval(clearTime);
//     }



//     global.cache.set('LKHKJAHKJGKADLKHAKFJAHKDJH', data, 90);
//     // 设置Content-Type:
//     ctx.response.type = 'image/png';
//     // 设置Response Body:
//     ctx.response.body = data;

// }

module.exports = {
    login,
    login_scan,
    // login_scan_long
}