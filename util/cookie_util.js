// const { APIError } = require("../middlewares/rest");

module.exports = {
    // 解析cookie
    parse (str) {

        let arr = str.split('; ');
        let a = {};

        // 捕获错误
        try {
            arr.forEach(element => {
                let e = element.split('=');
                a[e[0]] = e[1];
            });
        } catch (error) {
            throw new APIError('Cookie:parse_error', 'cookie parse error');
        }

        arr = null;
        return a;
    },
    serialization (data) {

        let cookie = '';
        for (let c in data) {
            let s = `${c}=${data[c]}; `;
            cookie += s;
        }
        if (cookie === '') {
            throw new APIError('Cookie:serialization_error', 'serialization error');
        }
        return cookie.substring(0, cookie.length - 2);
    }
}