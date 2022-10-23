const { default: axios } = require("axios");
const __Cookie = require('./util/cookie_util');

function getQQCookie(uin, count = 0) {
    if(count >= 3) {
        return;
    }

    axios.get('http://42.192.118.65:5100/qq/getCookie' + `?uin=${uin || ""}`).then(
        res => {
            if (res.data.cookie) {
                global.qq_cookie = __Cookie.parse(res.data.cookie);
                console.log("QQ Cookie更新成功");
            }
        }
    ).catch(err => {
        console.warn(`QQ Cookie更新函数内部错误, 重试中（${count+1} 次）`);
        getQQCookie(uin, ++count);
    })
}

module.exports = {
    getQQCookie
}