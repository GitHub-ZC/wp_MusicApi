// 解析cookie
const __Cookie = require('../../../util/cookie_util');

// 设置wy cookie
let setcookie = async (ctx) => {
    // 只允许POST方法
    if (ctx.request.method === 'POST') {
        var data = ctx.request.body.data || '';
    }

    if (!data) {
        throw new APIError('Cookie:data_notfound', 'argument data is not found');
    }

    global.wy_cookie = __Cookie.parse(data);
    // console.log(global.qq_cookie);

    ctx.rest({
        code: '成功',
        msg: 'Cookie add successful',
        status: 200
    });
}

// 获取qq cookie
let getcookie = async (ctx) => {
    // console.log(global.qq_cookie);
    ctx.rest(global.wy_cookie);
}


module.exports = {
    getcookie,
    setcookie
}