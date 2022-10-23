const { default: axios } = require("axios");
const __Cookie = require('./util/cookie_util');

let parseNative = (cookie) => {
    let arr = cookie.split(";;");
    let arr_ = arr.map(e => {
        return e.split("; ")[0]
    })
    arr_ = [...new Set(arr_)];
    return arr_.join("; ");
}


function getWYCookie(count = 0) {
    if(count > 10) {
        return;
    }

    axios.get('http://42.192.118.65:3000/login/cellphone?phone=15873146183&password=123123sty' + `&l=${count}`).then(
        res => {
            if (res.data.cookie) {
                global.wy_cookie = __Cookie.parse(parseNative(res.data.cookie));
                console.log(__Cookie.parse(parseNative(res.data.cookie)));
            }
        }
    ).catch(err => {
        console.warn(`函数内部错误, 重试中（${count+1} 次）`);
        getWYCookie(++count);
    })
}

module.exports = {
    getWYCookie
}