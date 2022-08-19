const axios = require('axios');
const { getEncryption } = require('./login_qq');
const qs = require('qs');


// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


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
    return function(e) {
        if (!e)
            return e;
        for (; e !== decodeURIComponent(e); )
            e = decodeURIComponent(e);
        var t = ["<", ">", "'", '"', "%3c", "%3e", "%27", "%22", "%253c", "%253e", "%2527", "%2522"]
          , n = ["&#x3c;", "&#x3e;", "&#x27;", "&#x22;", "%26%23x3c%3B", "%26%23x3e%3B", "%26%23x27%3B", "%26%23x22%3B", "%2526%2523x3c%253B", "%2526%2523x3e%253B", "%2526%2523x27%253B", "%2526%2523x22%253B"];
        return t.forEach((function(r, i) {
            e = e.replace(new RegExp(t[i],"gi"), n[i])
        }
        )),
        e
    }(t)
}

function f(e, cookie) {
    var t, n = 5381;
    if (t = !e ? s("qqmusic_key", cookie) || s("p_skey", cookie) || s("skey", cookie) || s("p_lskey", cookie) || s("lskey", cookie) : s("skey", cookie) || s("qqmusic_key", cookie))
        for (var r = 0, i = t.length; r < i; ++r)
            n += (n << 5) + t.charCodeAt(r);
    return 2147483647 & n
}


/**
 *  第一个参数是验证方式，叫ptVcodeV1

    第二个参数是验证码verifyCode

    第三个参数是uin，其实就是输入的QQ号的十六进制编码

    第四个参数是ptVerifysessionV1，也是用来验证的

    第五个参数是密码加密的盐ptRandSalt

    第六个参数是ptdrvs

    第七个参数是sid
 */


/** login参数
 *  u: 登陆的QQ号，和前面check的uin一致

    verifycode: 前面check返回的参数

    pt_verifysession_v1: 前面check返回的参数

    pt_randsalt: 前面返回的参数

    ptdrvs: 前面返回的参数

    sid：前面返回的参数

    login_sig 一个加密后的数据，统一环境是固定的，可以不需要

    action 拼接的字符串，16-76是固定的，后面是事件戳

    p: 加密后的密码
 */


/**
 *  参数分别是 QQ账号 and QQ密码
 */
module.exports = {
    login: async (uin, passwd) => {
        let url = `https://ssl.ptlogin2.qq.com/check?regmaster=&pt_tea=2&pt_vcode=1&uin=${uin}&appid=716027609&js_ver=22080914&js_type=1&login_sig=FrW9KnIndd6lGJEKxmIQtG-T0RzqIFq2tN7JeMKBJOdYSZVFDn-mnTs22i0N5QYc&u1=https%3A%2F%2Fgraph.qq.com%2Foauth2.0%2Flogin_jump&r=${Math.random()}&pt_uistyle=40&daid=383&pt_3rd_aid=100497308&o1vId=49283d5cbb01a744d46314da4608d929`;
        let result = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                Referer: 'https://xui.ptlogin2.qq.com/',
                Host: 'ssl.ptlogin2.qq.com'
            }
        });
    
        let arr = /\((.*?)\)/.exec(result.data);
        arr = arr[1].replace(/'/g, '');
        arr = arr.split(",")
        // console.log(arr);
    
    
        let res = await axios.get(`https://ssl.ptlogin2.qq.com/login`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                Referer: 'https://xui.ptlogin2.qq.com/',
                Host: 'ssl.ptlogin2.qq.com'
            },
            params: {
                u: uin,
                verifycode: arr[1],
                pt_vcode_v1: arr[0],
                pt_verifysession_v1: arr[3],
                p: getEncryption(uin, passwd, arr[1]),
                pt_randsalt: arr[4],
                u1: `https://graph.qq.com/oauth2.0/login_jump`,
                ptredirect: 0,
                h: 1,
                t: 1,
                g: 1,
                from_ui: 1,
                ptlang: 2052,
                action: `2-21-${Date.now()}`,
                js_ver: 22080914,
                js_type: 1,
                login_sig: ``,//FrW9KnIndd6lGJEKxmIQtG-T0RzqIFq2tN7JeMKBJOdYSZVFDn-mnTs22i0N5QYc
                pt_uistyle: 40,
                aid: 716027609,
                daid: 383,
                pt_3rd_aid: 100497308,
                ptdrvs: arr[5],
                sid: arr[6],
                '': '',
                o1vId: `49283d5cbb01a744d46314da4608d929`,
            }
        });
    
        // console.log(res.data);
        // console.log(res.headers['set-cookie']);
    
        // 返回 cookie
        let cookie = ParseSetCookie(res.headers['set-cookie']);
        // console.log(cookie);
    
    
    
        let arr1 = /\((.*?)\)/.exec(res.data);
        arr1 = arr1[1].replace(/'/g, '');
        arr1 = arr1.split(",")
    
    
        // 如果需要验证码，直接返回
        if(!arr1[2]) {
            return "异地登陆，需要验证码，请在QQ手机关闭登录保护";
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
                cookie: cookie['qq.com']
            },
            maxRedirects: 0,
            validateStatus: null
        });
    
        let musicu_fcg_cookie = ParseSetCookie(musicu_fcg.headers['set-cookie']);
    
        return musicu_fcg_cookie['qq.com'];
    }
}