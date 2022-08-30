const { default: axios } = require("axios");
const { kugou_request } = require("../../../util/kugou_request");
const APIError = require("../../../middlewares/rest").APIError;

// [{ id: 'kg__8888', name: '酷狗TOP500', bangid: '8888' }, { id: 'kg__6666', name: '酷狗飙升榜', bangid: '6666' }, { id: 'kg__37361', name: '酷狗雷达榜', bangid: '37361' }, { id: 'kg__23784', name: '网络红歌榜', bangid: '23784' }, { id: 'kg__24971', name: 'DJ热歌榜', bangid: '24971' }, { id: 'kg__35811', name: '会员专享热歌榜', bangid: '35811' }, { id: 'kg__31308', name: '华语新歌榜', bangid: '31308' }, { id: 'kg__31310', name: '欧美新歌榜', bangid: '31310' }, { id: 'kg__31311', name: '韩国新歌榜', bangid: '31311' }, { id: 'kg__31312', name: '日本新歌榜', bangid: '31312' }, { id: 'kg__31313', name: '粤语新歌榜', bangid: '31313' }, { id: 'kg__33162', name: 'ACG新歌榜', bangid: '33162' }, { id: 'kg__21101', name: '酷狗分享榜', bangid: '21101' }, { id: 'kg__30972', name: '腾讯音乐人原创榜', bangid: '30972' }, { id: 'kg__22603', name: '5sing音乐榜', bangid: '22603' }, { id: 'kg__33160', name: '电音热歌榜', bangid: '33160' }, { id: 'kg__21335', name: '繁星音乐榜', bangid: '21335' }, { id: 'kg__33161', name: '古风新歌榜', bangid: '33161' }, { id: 'kg__33163', name: '影视金曲榜', bangid: '33163' }, { id: 'kg__33166', name: '欧美金曲榜', bangid: '33166' }, { id: 'kg__33165', name: '粤语金曲榜', bangid: '33165' }, { id: 'kg__36107', name: '小语种热歌榜', bangid: '36107' }, { id: 'kg__4681', name: '美国BillBoard榜', bangid: '4681' }, { id: 'kg__4680', name: '英国单曲榜', bangid: '4680' }, { id: 'kg__4673', name: '日本公信榜', bangid: '4673' }, { id: 'kg__38623', name: '韩国Melon音乐榜', bangid: '38623' }, { id: 'kg__42807', name: 'joox本地热歌榜', bangid: '42807' }, { id: 'kg__42808', name: '台湾KKBOX风云榜', bangid: '42808' }]
// 排行榜歌曲详情
let top = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var topId = ctx.request.query.topId || '8888';
        // var limit = ctx.request.query.limit || '30';
        var offset = ctx.request.query.offset || '1';
        var platform = ctx.request.query.platform || 'web';
    } else if (ctx.request.method === 'POST') {
        var topId = ctx.request.body.topId || '8888';
        // var limit = ctx.request.body.limit || '30';
        var offset = ctx.request.body.offset || '1';
        var platform = ctx.request.body.platform || 'web';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    // 酷狗 leaderboard 接口走爬虫 以下是正则表达式
    let regExps = {
        total: /total: '(\d+)',/,
        page: /page: '(\d+)',/,
        limit: /pagesize: '(\d+)',/,
        listData: /global\.features = (\[.+\]);/,
    };


    let result = null;
    // 新增pc端 排行榜接口
    if (platform === 'pc') {
        result = await axios.post(`http://kmr.service.kugou.com/container/v2/rank_audio`, {"appid":1001,"clientver":"10053","mid":"70a02aad1ce4648e7dca77f2afa7b182","clienttime":1661650645,"key":"f1813b8c45644335d20b5054e255f8c5","area_code":"1","show_video":1,"page":1,"pagesize":500,"rank_id":topId,"rank_cid":topId,"zone":"tx6_gz_kmr"})
        global.cache.set(ctx.request.url, result.data, 3600);
        ctx.rest(result.data);
    } else {
        result = await kugou_request(`http://www2.kugou.kugou.com/yueku/v9/rank/home/${offset}-${topId}.html`);

        // 正则匹配
        let total = regExps.total.exec(result.data);
        let page = regExps.page.exec(result.data);
        let limit = regExps.limit.exec(result.data);
        let listData = regExps.listData.exec(result.data);

        global.cache.set(ctx.request.url, {
            code: 'success',
            msg: 'leaderboard',
            total: JSON.parse(total[1]),
            page: JSON.parse(page[1]),
            limit: JSON.parse(limit[1]),
            data: JSON.parse(listData[1])
        }, 3600);


        // 返回新数据，自己拼接的json数据
        ctx.rest({
            code: 'success',
            msg: 'leaderboard',
            total: JSON.parse(total[1]),
            page: JSON.parse(page[1]),
            limit: JSON.parse(limit[1]),
            data: JSON.parse(listData[1])
        });
    }
}

// 排行榜分类
let topCategory = async (ctx) => {
    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    
    // let result = await kugou_request('http://mobilecdnbj.kugou.com/api/v3/rank/list?version=9108&plat=0&showtype=2&parentid=0&apiver=6&area_code=1&withsong=1');
    let result = await axios.get(`https://gateway.kugou.com/ocean/v6/rank/list?srcappid=2919&dfid=10xLht0e9p5G2Gfkup4IHVuV&mid=212826578698488017179831213621749832494&signature=52321c148cf00a55c64f8534e5e6929f&clienttime=1661880203&uuid=4f3e2278033606d95d92efddc0744d9c&area_code=1&apiver=14&plat=1&withsong=1&showtype=2&clientver=11289&parentid=0&version=11289&cctv=1`);

    // result.data.data.info.splice(2, 2);
    // result.data.data.total = 31;

    global.cache.set(ctx.request.url, result.data, 3600);

    ctx.rest(result.data);
    result = null;
}

module.exports = {
    top,
    topCategory
}