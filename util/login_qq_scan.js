const { default: axios } = require("axios");
// const fs = require("fs");
const qs = require('qs');
const __Cookie = require('./cookie_util');


function f(e, cookie) {
    var t, n = 5381;
    if (t = !e ? s("qqmusic_key", cookie) || s("p_skey", cookie) || s("skey", cookie) || s("p_lskey", cookie) || s("lskey", cookie) : s("skey", cookie) || s("qqmusic_key", cookie))
        for (var r = 0, i = t.length; r < i; ++r)
            n += (n << 5) + t.charCodeAt(r);
    return 2147483647 & n
}

function s(e, cookie) {
    var t = null;
    var c = !0;
    var i = false;
    var r = false;
    if (c) {
        var n = cookie.match(RegExp("(^|;\\s*)" + e + "=([^;]*)(;|$)"));
        t = n ? decodeURIComponent(n[2]) : ""
    } else
        t = (null === i || void 0 === i ? void 0 : i.cookies[e]) || "";
    return function (e) {
        if (!e)
            return e;
        for (; e !== decodeURIComponent(e);)
            e = decodeURIComponent(e);
        var t = ["<", ">", "'", '"', "%3c", "%3e", "%27", "%22", "%253c", "%253e", "%2527", "%2522"]
            , n = ["&#x3c;", "&#x3e;", "&#x27;", "&#x22;", "%26%23x3c%3B", "%26%23x3e%3B", "%26%23x27%3B", "%26%23x22%3B", "%2526%2523x3c%253B", "%2526%2523x3e%253B", "%2526%2523x27%253B", "%2526%2523x22%253B"];
        return t.forEach((function (r, i) {
            e = e.replace(new RegExp(t[i], "gi"), n[i])
        }
        )),
            e
    }(t)
}


function ParseSetCookie(arr) {
    let cookies = [];
    let a = {}, s = {};

    if (!Array.isArray(arr)) {
        return '获取失败, 请检查账号或密码，请检查是否异地登录';
    }

    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].replace('SameSite=None;', "");
        // arr[i] = arr[i].replace(/=o/g, "=");
        let cookie = parse(/([^=;\s]+)=([^;]+);?/g, arr[i].replace(/;HttpOnly/g, "$&=true"));
        // console.log(cookie);
        cookies.push(cookie);
    }

    cookies.map(e => {
        if (a[e.Domain] == undefined) {
            a[e.Domain] = [];
        }
        for (let s of Object.keys(e)) {
            if (!(s == 'Expires' || s == 'Path' || s == 'Domain' || s == 'HttpOnly')) {
                a[e.Domain].push([s, e[s]]);
            }
        }
    });

    function parse(reg, text) {
        if (!reg || !text) return {}
        const hash = {};
        let res = reg.exec(text);
        while (res !== null) {
            hash[res[1]] = res[2];
            res = reg.exec(text);
        }
        return hash;
    }


    for (let i in a) {
        s[i] = '';
        for (let j of a[i]) {
            s[i] += j.join("=") + '; ';
        }
        s[i] = s[i].slice(0, -2);
    }
    return s;
}

// }();
var q = {};
q.str = {
    no_uin: "你还没有输入帐号！",
    no_pwd: "你还没有输入密码！",
    no_vcode: "你还没有输入验证码！",
    inv_uin: "请输入正确的帐号！",
    inv_vcode: "请输入完整的验证码！",
    qlogin_expire: "你所选择号码对应的QQ已经失效，请检查该号码对应的QQ是否已经被关闭。",
    other_login: "帐号登录",
    h_pt_login: "密码登录",
    otherqq_login: "QQ帐号密码登录",
    onekey_return: "返回扫码登录"
},
    q.ptui = {
        s_url: "https\x3A\x2F\x2Fgraph.qq.com\x2Foauth2.0\x2Flogin_jump",
        proxy_url: "",
        jumpname: encodeURIComponent(""),
        mibao_css: encodeURIComponent(""),
        defaultUin: "",
        lockuin: parseInt("0"),
        href: "https\x3A\x2F\x2Fxui.ptlogin2.qq.com\x2Fcgi-bin\x2Fxlogin\x3Fappid\x3D716027609\x26daid\x3D383\x26style\x3D33\x26login_text\x3D\x25E7\x2599\x25BB\x25E5\x25BD\x2595\x26hide_title_bar\x3D1\x26hide_border\x3D1\x26target\x3Dself\x26s_url\x3Dhttps\x253A\x252F\x252Fgraph.qq.com\x252Foauth2.0\x252Flogin_jump\x26pt_3rd_aid\x3D100497308\x26pt_feedback_link\x3Dhttps\x253A\x252F\x252Fsupport.qq.com\x252Fproducts\x252F77942\x253FcustomInfo\x253D.appid100497308\x26theme\x3D2\x26verify_theme\x3D",
        login_sig: "",
        clientip: "",
        serverip: "",
        version: "202208091446",
        ptui_version: encodeURIComponent("22080914"),
        isHttps: !1,
        cssPath: "https://ui.ptlogin2.qq.com/style.ssl/40",
        domain: encodeURIComponent("qq.com"),
        fromStyle: parseInt(""),
        pt_3rd_aid: encodeURIComponent("100497308"),
        appid: encodeURIComponent("716027609"),
        lang: encodeURIComponent("2052"),
        style: encodeURIComponent("40"),
        low_login: encodeURIComponent("0"),
        daid: encodeURIComponent("383"),
        regmaster: encodeURIComponent(""),
        enable_qlogin: "1",
        noAuth: "0",
        target: isNaN(parseInt("0")) ? {
            _top: 1,
            _self: 0,
            _parent: 2
        }["0"] : parseInt("0"),
        csimc: encodeURIComponent("0"),
        csnum: encodeURIComponent("0"),
        authid: encodeURIComponent("0"),
        auth_mode: encodeURIComponent("0"),
        pt_qzone_sig: "0",
        pt_light: "0",
        pt_vcode_v1: "1",
        pt_ver_md5: "000D64FF6AF2E4247B21E209EB22A1DBCF002087B988CCCCD4B51233",
        gzipEnable: "1"
    };


let isTim = 41 == q.ptui.style;


let __get_polling_url = function (t) {
    t = (q.ptui.isHttps ? "https://ssl." : "http://") + "ptlogin2." + q.ptui.domain + "/" + t + "?";
    return t += "appid=" + q.ptui.appid + "&e=2&l=M&s=3&d=72&v=4&t=" + Math.random(),
        q.ptui.regmaster && (t += "&regmaster=" + q.ptui.regmaster),
        q.ptui.daid && (t += "&daid=" + q.ptui.daid),
        isTim && (t += "&tim=1"),
        q.ptui.pt_3rd_aid && (t += "&pt_3rd_aid=" + q.ptui.pt_3rd_aid),
        t
};

let get_qrlogin_pic = function () {
    return __get_polling_url("ptqrshow")
};


let login_qq_scan = async (arr) => {
    // let d = get_qrlogin_pic();
    // console.log(d);

    // let res = await axios.request({
    //     url: d,
    //     method: 'GET',
    //     responseType: 'arraybuffer'
    // });
    // console.log(res.data);

    // fs.writeFile(`./${Date.now()}.png`, res.data, function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    // });

    // return_data.PIC = res.data;

    // let arr = res.headers['set-cookie'];
    let arr_ = arr;
    if (arr.length === 0) return;
    arr = arr[0].split(";");
    arr = arr[0].split('=');
    if (arr.length !== 2) return;
    arr = arr[1];

    // console.log(arr);

    let hash33 = function (t) {
        for (var e = 0, n = 0, o = t.length; n < o; ++n)
            e += (e << 5) + t.charCodeAt(n);
        return 2147483647 & e
    }

    let ptqrtoken = hash33(arr);

    let a = {
        u1: 'https://graph.qq.com/oauth2.0/login_jump',
        ptqrtoken: ptqrtoken,
        ptredirect: 0,
        h: 1,
        t: 1,
        g: 1,
        from_ui: 1,
        ptlang: 2052,
        action: `0-0-` + Date.now(),
        js_ver: 22080914,
        js_type: 1,
        login_sig: '',
        pt_uistyle: 40,
        aid: 716027609,
        daid: 383,
        pt_3rd_aid: 100497308,
        o1vId: '49283d5cbb01a744d46314da4608d929',
    }

    // 定时器
    let timer = '';
    try {
        let checkStatus = "";

        timer = setInterval(async () => {
            checkStatus = await axios.get(`https://ssl.ptlogin2.qq.com/ptqrlogin`, {
                params: a,
                headers: {
                    Host: 'ssl.ptlogin2.qq.com',
                    Referer: 'https://xui.ptlogin2.qq.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                    Cookie: `qrsig=${arr}`
                }
            });
            console.log(checkStatus.data);

            let arr1 = /\((.*?)\)/.exec(checkStatus.data);
            arr1 = arr1[1].replace(/'/g, '');
            arr1 = arr1.split(",");

            if (arr1[0] == '65' || arr1[0] == '68') {
                clearInterval(timer);
                return;
            }

            if (arr1[0] == '0') {
                clearInterval(timer);
                let cookie = ParseSetCookie(arr_);
                // console.log(cookie);
                // 如果需要验证码，直接返回
                if (!arr1[2]) {
                    console.log("异地登陆，需要验证码，请在QQ手机关闭登录保护");
                    return;
                }


                // console.log(arr1[2]);
                let res1 = await axios.request({
                    url: arr1[2],
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                        Host: 'ssl.ptlogin2.graph.qq.com',
                        Referer: 'https://xui.ptlogin2.qq.com/',
                        cookie: cookie['ptlogin2.qq.com']
                    },
                    maxRedirects: 0,
                    validateStatus: null
                })

                let check_sig_cookie = ParseSetCookie(res1.headers['set-cookie']);
                // console.log(check_sig_cookie);


                let a = {
                    response_type: "code",
                    client_id: "100497308",
                    redirect_uri: "https://y.qq.com/portal/wx_redirect.html?login_type=1&surl=https://y.qq.com/",
                    scope: "all",
                    state: "state",
                    switch: "",
                    from_ptlogin: "1",
                    src: "1",
                    update_auth: "1",
                    openapi: "80901010_1030",
                    g_tk: f(undefined, check_sig_cookie['graph.qq.com']),
                    auth_time: Date.now(),
                    ui: "DFEC5395-9E69-4D3E-96A6-300BB770874D"
                }

                let res2 = await axios.request({
                    method: "POST",
                    data: qs.stringify(a),
                    url: "https://graph.qq.com/oauth2.0/authorize",
                    headers: {
                        // cookie: 'ui=DFEC5395-9E69-4D3E-96A6-300BB770874D; pgv_pvid=4797862800; ptui_loginuin=153140965; fqm_pvqid=210032b4-c97a-4fce-8725-744c0f813a99; RK=SeGN/mgFY/; ptcz=41462cba1c000fd0410bfaa8d714b75bdf138d006f5922711fd651dc038af531; psrf_access_token_expiresAt=1668233987; tmeLoginType=2; euin=7icA7KSA7K6s; fqm_sessionid=6e790cd3-83d0-49d2-afe6-01d1af96d802; pgv_info=ssid=s9183859256; _qpsvr_localtk=0.5137247361136548; p_uin=o0153140965; pt4_token=fHnD5z09abzH93gLNtoqluX3E*VWO3AFybuRLwZDf7c_; p_skey=VHJHlCyy*SZPr6nP50kWchujr02pDtXdasd7OaRuAJ8_; pt_oauth_token=quxHeMFxYi1JF*wE7haP9ORhTDepFyTk-Fv*qm86pKxyISFPYlR2j7jv5dwekW3hMq5UALPrHi8_; pt_login_type=1'
                        cookie: check_sig_cookie['graph.qq.com']
                    },
                    maxRedirects: 0,
                    validateStatus: null
                });


                // console.log(res2.headers.location);


                let code = /&code=(.*?)&/.exec(res2.headers.location);
                code = code[1];


                let musicu_fcg_data = `{"comm":{"g_tk":5381,"platform":"yqq","ct":24,"cv":0},"req":{"module":"QQConnectLogin.LoginServer","method":"QQLogin","param":{"code":"${code}"}}}`;

                let musicu_fcg = await axios.request({
                    method: "POST",
                    data: musicu_fcg_data,
                    url: "https://u.y.qq.com/cgi-bin/musicu.fcg",
                    headers: {
                        // cookie: 'ui=DFEC5395-9E69-4D3E-96A6-300BB770874D; pgv_pvid=4797862800; ptui_loginuin=153140965; fqm_pvqid=210032b4-c97a-4fce-8725-744c0f813a99; RK=SeGN/mgFY/; ptcz=41462cba1c000fd0410bfaa8d714b75bdf138d006f5922711fd651dc038af531; psrf_access_token_expiresAt=1668233987; tmeLoginType=2; euin=7icA7KSA7K6s; fqm_sessionid=6e790cd3-83d0-49d2-afe6-01d1af96d802; pgv_info=ssid=s9183859256; _qpsvr_localtk=0.5137247361136548; p_uin=o0153140965; pt4_token=fHnD5z09abzH93gLNtoqluX3E*VWO3AFybuRLwZDf7c_; p_skey=VHJHlCyy*SZPr6nP50kWchujr02pDtXdasd7OaRuAJ8_; pt_oauth_token=quxHeMFxYi1JF*wE7haP9ORhTDepFyTk-Fv*qm86pKxyISFPYlR2j7jv5dwekW3hMq5UALPrHi8_; pt_login_type=1'
                        cookie: cookie['qq.com'] ? cookie['qq.com'] : ''
                    },
                    maxRedirects: 0,
                    validateStatus: null
                });

                let musicu_fcg_cookie = ParseSetCookie(musicu_fcg.headers['set-cookie']);

                if(musicu_fcg_cookie['qq.com']) {
                    global.qq_cookie = __Cookie.parse(musicu_fcg_cookie['qq.com']);
                }
            }
        }, 3000);
    } catch (error) {
        clearInterval(timer);
    }
};



module.exports = {
    login_qq_scan,
    get_qrlogin_pic
}