// const { migu_request } = require("../../../util/migu_request");
const APIError = require("../../../middlewares/rest").APIError;

// 解析cookie
const __Cookie = require('../../../util/cookie_util');

// 设置qq cookie
let setcookie = async (ctx) => {
    // 只允许POST方法
    if (ctx.request.method === 'POST') {
        var data = ctx.request.body.data || '';
    }

    if (!data) {
        throw new APIError('Cookie:data_notfound', 'argument data is not found');
    }

    global.migu_cookie = __Cookie.parse(data);

    ctx.rest({
        code: '成功',
        msg: 'Cookie add successful',
        status: 200
    });
}

// 获取qq cookie
let getcookie = async (ctx) => {
   
    ctx.rest(global.migu_cookie);
}

module.exports = {
    getcookie,
    setcookie
}