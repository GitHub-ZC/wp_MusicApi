// const { qq_request } = require("../../../util/qq_request");
const APIError = require("../../../middlewares/rest").APIError;
const getSign = require("../../../util/sign");

// 解析cookie
const __Cookie = require('../../../util/cookie_util');
const { qq_request } = require("../../../util/qq_request");
const { default: axios } = require("axios");

// 设置qq cookie
let setcookie = async (ctx) => {
    // 只允许POST方法
    if (ctx.request.method === 'POST') {
        var data = ctx.request.body.data || '';
    }

    if (!data) {
        throw new APIError('Cookie:data_notfound', 'argument data is not found');
    }

    global.qq_cookie = __Cookie.parse(data);
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
    ctx.rest(global.qq_cookie);
}

// 刷新cookie
let refresh = async (ctx) => {
    const {uin, qm_keyst, qqmusic_key} = global.qq_cookie
    if (!uin || !(qm_keyst || qqmusic_key)) {
        ctx.rest({
            result: 301,
            errMsg: '未登陆'
        });
        return ;
    }
    const data = {
        req1: {
            module: "QQConnectLogin.LoginServer",
            method: "QQLogin",
            param: {
                expired_in: 7776000, //不用管
                // onlyNeedAccessToken: 0, //不用管
                // forceRefreshToken: 0, //不用管
                // access_token: "6B0C62126368CA1ACE16C932C679747E", //access_token
                // refresh_token: "25BACF1650EE2592D06BCC19EEAD7AD6", //refresh_token
                musicid: uin, //uin或者web_uin 微信没试过
                musickey: qm_keyst || qqmusic_key, //key
            },
        },
    };
    const sign = getSign(data);
    let url = `https://u6.y.qq.com/cgi-bin/musics.fcg?sign=${sign}&format=json&inCharset=utf8&outCharset=utf-8&data=${encodeURIComponent(
        JSON.stringify(data)
    )}`;

    const d = await axios.get(url);
    const result = d.data;

    // if (result.req1 && result.req1.data && result.req1.data.musickey) {
    //     const musicKey = result.req1.data.musickey;
    //     ['qm_keyst', 'qqmusic_key'].forEach((k) => {
    //         __Cookie.parse({...global.qq_cookie, [k]: val})
    //     __Cookie.parse(k, musicKey, {expires: new Date(Date.now() + 86400000)})
    //     })
    //     ctx.rest({
    //         result: 100,
    //         data: {
    //             musickey: result.req1.data.musickey,
    //         }
    //     });
    //     return ;
    // }
    ctx.rest({
      result: 200,
      errMsg: '刷新失败，建议重新设置cookie'
    })
  }

module.exports = {
    getcookie,
    setcookie,
    refresh
}