const APIError = require("../../../middlewares/rest").APIError;

// 解析cookie
const __Cookie = require('../../../util/cookie_util');
// const { kugou_request } = require("../../../util/kugou_request");
// const { default: axios } = require("axios");

// 设置kugou cookie
let setcookie = async (ctx) => {
    // 只允许POST方法
    if (ctx.request.method === 'POST') {
        var data = ctx.request.body.data || '';
    }

    if (!data) {
        throw new APIError('Cookie:data_notfound', 'argument data is not found');
    }

    global.kugou_cookie = __Cookie.parse(data);
    // console.log(global.qq_cookie);

    ctx.rest({
        code: '成功',
        msg: 'Cookie add successful',
        status: 200
    });
}

// 获取kugou cookie
let getcookie = async (ctx) => {
    ctx.rest(global.kugou_cookie);
}


module.exports = {
    getcookie,
    setcookie
}