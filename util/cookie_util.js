const APIError = require("../middlewares/rest").APIError;

module.exports = {
    // 解析cookie， 解析字符串类型的cookie，在内存中使用对象来表示
    parse (cookies) {
        // 捕获错误
        try {
            if(typeof cookies === 'string') {
                const cookieObj = {};
                cookies.split('; ').forEach((c) => {
                    const arr = c.split('=');
                    let key = arr[0];
                    let value = arr[1];
                    if(arr.length > 2) {
                        arr.shift();
                        value = arr.join('=');
                    }
                    cookieObj[key.toString()] = value;
                });
                // console.log(cookieObj);
                return cookieObj;
            } else if(typeof cookies === 'object') {
                return cookies;
            } else {
                throw new Error("parse error");
            }
        } catch (error) {
            // throw error;
            throw new APIError('Cookie:parse_error', 'cookie parse error');
        }
    },
    // 序列化 Cookie， 将内存中的cookie对象，转化成 对应字符串，主要用于 header 中的请求头
    serialization (data) {

        let cookie = '';
        for (let c in data) {
            let s = `${encodeURI(c)}=${encodeURI(data[c])}; `;
            cookie += s;
        }
        if (cookie === '') {
            throw new APIError('Cookie:serialization_error', 'serialization error');
        }
        // console.log(cookie.substring(0, cookie.length - 4));
        return cookie.substring(0, cookie.length - 2);
    }
}