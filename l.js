const { default: axios } = require("axios");
const __Cookie = require('./util/cookie_util');
const config = require("./setting");

let parseNative = (cookie) => {
    let arr = cookie.split(";;");
    let arr_ = arr.map(e => {
        return e.split("; ")[0]
    })
    arr_ = [...new Set(arr_)];
    return arr_.join("; ");
}


function getWYCookie(count = 0) {
    if(count > 2) {
        return;
    }

    axios.get(`http://localhost:${config.port}/v1/wy/login/refresh`).then(
        res => {
            console.log(res.data);
        }
    ).catch(err => {
        console.warn(`更新网易cookie函数内部错误, 重试中（${count+1} 次）`);
        getWYCookie(++count);
    })
}

module.exports = {
    getWYCookie
}