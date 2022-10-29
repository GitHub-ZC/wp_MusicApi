
const Cache = require('../../util/cache');
const v1 = require('./controllers');


// 自定义库
const config = require('../../setting');
const __Cookie = require('../../util/cookie_util');
const { getWYCookie } = require('../../l');
const { getQQCookie } = require('../../refreshQQCookie');
const { default: axios } = require('axios');


// 设置qq音乐的cookie
global.qq_cookie = __Cookie.parse(config.qq_cookie);
global.migu_cookie = __Cookie.parse(config.migu_cookie);
global.kugou_cookie = __Cookie.parse(config.kugou_cookie);
global.wy_cookie = __Cookie.parse(config.wy_cookie);

global.cache = new Cache();


setInterval(() => {
    global.cache.clear();
}, 3000);

// //更新网易云cookie
// // setTimeout(() => {
// //     getWYCookie();
// // }, 10 * 1000);

// setInterval(() => {
//     getWYCookie();
// }, 1000 * 60 * 60 * 24 * 12);

// 更新QQcookie
// setTimeout(() => {
//     getQQCookie(config.QQ_uin);
// }, 0);

// setInterval(() => {
//     getQQCookie(config.QQ_uin);
// }, 1000 * 60 * 60);



module.exports = (() => {
    // 遍历每一个对象
    let route = {};
    v1.stack ? v1.stack.forEach(element => {
        route[element.path] = element.stack[0] ? (async (query = {}) => {
            let result;

            rest = function (data) {
                result = data;
            };

            try {
                await element.stack[0]({
                    request: {
                        url: `${element.path}---${JSON.stringify(query)}`,
                        method: 'GET',
                        query
                    },
                    rest
                });
            } catch (e) {
                result = {
                    code: e.code || 'internal:unknown_error',
                    message: e.message || ''
                };
            }

            return result;
        }) : null;
    }) : {};

    return route;
})();