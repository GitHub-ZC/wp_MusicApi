const { default: axios } = require("axios");

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
console.log(
    parseNative("MUSIC_R_T=1469956989474; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/wapi/feedback;;MUSIC_A_T=1469956971029; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/weapi/clientlog;;MUSIC_R_T=1469956989474; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/weapi/clientlog;;__remember_me=true; Max-Age=1296000; Expires=Fri, 14 Oct 2022 15:10:37 GMT; Path=/;;__csrf=61583a0810eb31c33743e43b54e4001d; Max-Age=1296010; Expires=Fri, 14 Oct 2022 15:10:47 GMT; Path=/;;MUSIC_A_T=1469956971029; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/wapi/feedback;;MUSIC_A_T=1469956971029; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/api/clientlog;;MUSIC_A_T=1469956971029; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/openapi/clientlog;;MUSIC_R_T=1469956989474; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/openapi/clientlog;;MUSIC_A_T=1469956971029; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/eapi/clientlog;;MUSIC_A_T=1469956971029; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/weapi/feedback;;MUSIC_R_T=1469956989474; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/eapi/feedback;;MUSIC_A_T=1469956971029; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/eapi/feedback;;MUSIC_U=71278ae4829eb7192e53d3b92c838eed150864f72467c429d5f64da40b7ce255d1f884fb69b702f85e2e9882e15089a20c22d74d740d67711654cf6709263a0d1d645bedcf7aeb9aa89fe7c55eac81f3; Max-Age=1296000; Expires=Fri, 14 Oct 2022 15:10:37 GMT; Path=/;;MUSIC_R_T=1469956989474; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/eapi/clientlog;;MUSIC_R_T=1469956989474; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/neapi/feedback;;MUSIC_A_T=1469956971029; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/wapi/clientlog;;MUSIC_A_T=1469956971029; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/neapi/feedback;;MUSIC_R_T=1469956989474; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/api/feedback;;MUSIC_R_T=1469956989474; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/wapi/clientlog;;MUSIC_A_T=1469956971029; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/api/feedback;;MUSIC_R_T=1469956989474; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/api/clientlog;;MUSIC_A_T=1469956971029; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/neapi/clientlog;;MUSIC_R_T=1469956989474; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/weapi/feedback;;MUSIC_SNS=; Max-Age=0; Expires=Thu, 29 Sep 2022 15:10:37 GMT; Path=/;MUSIC_R_T=1469956989474; Max-Age=2147483647; Expires=Tue, 17 Oct 2090 18:24:44 GMT; Path=/neapi/clientlog;")
);
module.exports = {
    getWYCookie
}