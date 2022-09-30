const { default: axios } = require("axios");
const { sign } = require("../../../util/qqsign");
const { qq_request } = require("../../../util/qq_request");
const APIError = require("../../../middlewares/rest").APIError;


// t: 0：单曲，2：歌单，3:用户 ,7：歌词，8：专辑，9：歌手，12：mv
let search = async (ctx) => {
    // 关键字搜索（t: 0：单曲，2：歌单，3:用户 ,7：歌词，8：专辑，9：歌手，12：mv）
    if (ctx.request.method === 'GET') {
        var key = ctx.request.query.key || '';
        var limit = ctx.request.query.limit || '30';
        var offset = ctx.request.query.offset || '1';
        var type = ctx.request.query.type || '0';
    } else if (ctx.request.method === 'POST') {
        var key = ctx.request.body.key || '';
        var limit = ctx.request.body.limit || '30';
        var offset = ctx.request.body.offset || '1';
        var type = ctx.request.body.type || '0';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let data_mv = { "comm": { "cv": 4747474, "ct": 24, "format": "json", "inCharset": "utf-8", "outCharset": "utf-8", "notice": 0, "platform": "yqq.json", "needNewCode": 1, "uin": global.qq_cookie.uin, "g_tk_new_20200303": 1354167863, "g_tk": 1354167863 }, "req_1": { "method": "DoSearchForQQMusicDesktop", "module": "music.search.SearchCgiService", "param": { "remoteplace": "txt.yqq.center", "searchid": Oe(p), "search_type": 4, "query": key, "page_num": offset.trim(), "num_per_page": limit.trim() } } }

    // console.log(Oe(p));
    // console.log(sign(data_mv));
    // search_type：
    // 0：单曲
    // 1：歌手
    // 2：专辑
    // 3：歌单
    // 4：mv
    // 7：歌词
    // 8：用户
    let url = '';
    if (['0', '1', '2', '3', '4', '7', '8'].includes(type)) {
        url = `https://u.y.qq.com/cgi-bin/musicu.fcg`
        //url = `https://shc.y.qq.com/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&remoteplace=txt.yqq.top&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&t=${type.trim()}&p=${offset.trim()}&n=${limit.trim()}&w=${encodeURIComponent(key.trim())}&cv=4747474&ct=24&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&uin=0&hostUin=0&loginUin=0`
        // url = `https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?format=json&w=${encodeURI(key.trim())}&n=${encodeURI(limit.trim())}&p=${encodeURI(offset.trim())}`;
        // url = `https://c.y.qq.com/soso/fcgi-bin/client_search_cp?t=${type.trim()}&cr=1&p=${offset.trim()}&n=${limit.trim()}&w=${encodeURI(key)}&format=json`;
    } // else if (type === '2') {
    //     url = `https://c.y.qq.com/soso/fcgi-bin/client_music_search_songlist?remoteplace=txt.yqq.playlist&page_no=${parseInt(offset.trim()) - 1}&num_per_page=${limit.trim()}&query=${encodeURI(key)}&format=json`;
    // } else if (type === '3') {
    //     url = `https://c.y.qq.com/soso/fcgi-bin/client_search_user?p=${offset.trim()}&n=${limit.trim()}&searchid=241014031194265199&remoteplace=txt.yqq.user&w=${encodeURI(key)}&format=json`;
    // }


    let result = await axios.post(url, {
        // "music.search.SearchCgiService": {
        //     "method": "DoSearchForQQMusicDesktop",
        //     "module": "music.search.SearchCgiService",
        //     "param": {
        //         "num_per_page": limit.trim(),
        //         "page_num": offset.trim(),
        //         "query": key,
        //         "search_type": type.trim()
        //     }
        // }
        comm: {
            ct: '19',
            cv: '1859',
            uin: '0',
        },
        req: {
            method: 'DoSearchForQQMusicDesktop',
            module: 'music.search.SearchCgiService',
            param: {
                grp: 1,
                num_per_page: parseInt(limit.trim()),
                page_num: parseInt(offset.trim()),
                query: key,
                search_type: type.trim(),
            },
        },
    }, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
        },
    });
    // console.log(__Cookie.parse(global.qq_cookie));

    global.cache.set(ctx.request.url, result.data);

    // 捕捉服务端解析错误，防止程序退出
    ctx.rest(result.data);
    result = null;
}

// 热搜
let hotSearch = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var from = ctx.request.query.from || 'pc';
    } else if (ctx.request.method === 'POST') {
        var from = ctx.request.body.from || 'pc';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    if (from === 'web') {
        var result = (await qq_request('https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?format=json')).data;
    } else if (from === 'pc') {
        let html = await qq_request('https://i.y.qq.com/n2/m/index.html');

        let rule = /<script>window.__INIT_DATA__=(.*?)\<\/script>/;

        let arr = rule.exec(html.data);
        var result = JSON.parse(arr[1]).homeData.hotList;
    }

    global.cache.set(ctx.request.url, result.data);

    ctx.rest(result);
    result = null;
}

// 搜索建议
let suggestSearch = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var key = ctx.request.query.key || '';
    } else if (ctx.request.method === 'POST') {
        var key = ctx.request.body.key || '';
    }

    let result = await qq_request(`https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?key=${encodeURI(key)}&format=json`);
    ctx.rest(result.data);
}

let p = {
    song: 3,
    album: 4,
    playlist: 6,
    user: 13,
    lyric: 5,
    mv: 7
}

let Ee = function (e, t) {
    for (var n = ''.concat(e).split('').reverse(), a = ''.concat(t).split('').reverse(), r = n.length, c = a.length, i = 0, o = 0, s = 0, l = 0, u = 0, m = Math.max(r, c); u < m; u++) o = u < r ? kkkk(n[u], 10) : 0,
        s = u < c ? kkkk(a[u], 10) : 0,
        l = Math.round(o) + Math.round(s) + i,
        n[u] = ''.concat(l % 10),
        i = l >= 10 ? 1 : 0;
    return 1 == i && n.push('1'),
        n.reverse().join('')
}

let ye = function (e, t) {
    for (var n = ''.concat(e).split('').reverse(), a = ''.concat(t).split('').reverse(), r = [
    ], c = n.length, i = a.length, o = 0, s = c + i - 1; o <= s; o++) r[o] = 0;
    for (var l = 0; l < i; l++) for (var u = 0; u < c; u++) r[u + l] += kkkk(n[u], 10) * kkkk(a[l], 10),
        r[u + 1 + l] += Math.floor(r[u + l] / 10),
        r[u + l] = r[u + l] % 10;
    return r.reverse(),
        0 == r[0] && r.shift(),
        r.join('')
}
let Oe = function (e) {
    var t = ye(e, '18014398509481984'),
        n = ye(Math.round(Math.random() * kkkk('4194304', 10)), '4294967296'),
        a = new Date,
        r = 1000 * (3600 * a.getHours() + 60 * a.getMinutes() + a.getSeconds()) + a.getMilliseconds();
    return Ee(Ee(t, n), r)
}

let xx = function (e) {
    if (void 0 == e) throw TypeError('Can\'t call method on  ' + e);
    return e
}

let i = function (e, t) {
    return e = String(xx(e)),
        1 & t && (e = e.replace(l, '')),
        2 & t && (e = e.replace(c, '')),
        e
}

let u = '[' + "\t\n\u000b\u000c\r   ᠎             　\u2028\u2029\ufeff" + ']';
let l = RegExp('^' + u + u + '*');
let c = RegExp(u + u + '*$');
let a = /^[-+]?0[xX]/;

let kkkk = function (e, t) {
    var n = i(String(e), 3);
    return parseInt(n, t >>> 0 || (a.test(n) ? 16 : 10))
}

module.exports = {
    search,
    hotSearch,
    suggestSearch
}