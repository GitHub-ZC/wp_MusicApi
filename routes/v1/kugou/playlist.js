const { kugou_request } = require("../../../util/kugou_request");
const APIError = require("../../../middlewares/rest").APIError;

// http://www2.kugou.kugou.com/yueku/v9/special/index/   酷狗歌单, 爬虫
// 歌单标签分类
let playlist_tagCategory = async (ctx) => {

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let result = await kugou_request(`http://www2.kugou.kugou.com/yueku/v9/special/getSpecial`, {
        is_smarty: 1
    });
    
    global.cache.set(ctx.request.url, result.data);

    ctx.rest(result.data);
}

// 歌单标签下的歌单列表, 每一页默认二十首，官方接口规定
let playlist_Tag = async (ctx) => {

    if (ctx.request.method === 'GET') {
        var tagid = ctx.request.query.tagid || '';
        // var flag = ctx.request.query.flag || '0';
        var sortId = ctx.request.query.sortId || '5';
        // var limit = ctx.request.query.limit || '30';
        var offset = ctx.request.query.offset || '1';
    } else if (ctx.request.method === 'POST') {
        var tagid = ctx.request.body.tagid || '';
        // var flag = ctx.request.body.flag || '0';
        var sortId = ctx.request.body.sortId || '5';
        // var limit = ctx.request.body.limit || '30';
        var offset = ctx.request.body.offset || '1';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    // 歌单 标签 的详细内容
    // let sortList = [
    //     {
    //       name: '推荐',
    //       id: '5',
    //     },
    //     {
    //       name: '最热',
    //       id: '6',
    //     },
    //     {
    //       name: '最新',
    //       id: '7',
    //     },
    //     {
    //       name: '热藏',
    //       id: '3',
    //     },
    //     {
    //       name: '飙升',
    //       id: '8',
    //     },
    // ];
    if (!(['3', '5', '6', '7', '8'].includes(sortId))) {
        throw new APIError("Playlist:sort_notfound", "argument sortId not exist in list");
    }
    
    // 请求官方接口，得到歌单信息
    var result = await kugou_request(`http://www2.kugou.kugou.com/yueku/v9/special/getSpecial`, {
        p: offset.trim(),
        c: tagid.trim(),
        t: sortId.trim(),
        is_ajax: 1,
        cdn: 'cdn'
    });
    
    global.cache.set(ctx.request.url, result.data);

    ctx.rest(result.data);
}


// 歌单的歌曲信息
let playlist_Info = async (ctx) => {

    if (ctx.request.method === 'GET') {
        var pid = ctx.request.query.pid || '3233449';
        // var limit = ctx.request.query.limit || '30';
        // var offset = ctx.request.query.offset || '1';
    } else if (ctx.request.method === 'POST') {
        var pid = ctx.request.body.pid || '3233449';
        // var limit = ctx.request.body.limit || '30';
        // var offset = ctx.request.body.offset || '1';
    }

    // 判断数据是否缓存
    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    // 正则表达式
    let regExps = {
        listData: /global\.data = (\[.+\]);/,
        listInfo: /global = {[\s\S]+?name: "(.+)"[\s\S]+?pic: "(.+?)"[\s\S]+?};/s
        // https://www.kugou.com/yy/special/single/1067062.html
        // listDetailLink: /^.+\/(\d+)\.html(?:\?.*|&.*$|#.*$|$)/s
    };

    // 这个是html 需要使用正则 抓取数据
    let result = await kugou_request(`http://www2.kugou.kugou.com/yueku/v9/special/single/${pid}-6-1084.html`);

    // 正则匹配
    let listData = regExps.listData.exec(result.data);
    let listInfo = regExps.listInfo.exec(result.data);
    // let listDetailLink = regExps.listDetailLink.exec(result.data);

    // console.log(listDetailLink);
    // console.log(listInfo[1]);
    // console.log(listData[1]);

    // 设置缓存
    global.cache.set(ctx.request.url, {
        code: 'success',
        msg: 'playlist Info',
        name: listInfo[1] ? listInfo[1] : '',
        picurl: listInfo[2] ? listInfo[2] : '',
        listData: listData[1] ? JSON.parse(listData[1]) : null
        // listDetailLink: JSON.parse(listDetailLink[1])
    });

    // 接口返回数据
    ctx.rest({
        code: 'success',
        msg: 'playlist Info',
        name: listInfo[1] ? listInfo[1] : '',
        picurl: listInfo[2] ? listInfo[2] : '',
        listData: listData[1] ? JSON.parse(listData[1]) : null
        // listDetailLink: JSON.parse(listDetailLink[1])
    })
}


// 歌单广场，随机返回30个歌单
let playlist_list = async (ctx) => {
    
    if (ctx.request.method === 'GET') {
        var offset = ctx.request.query.offset || '1';
    } else if (ctx.request.method === 'POST') {
        var offset = ctx.request.body.offset || '1';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }


    let result = await kugou_request(`https://m.kugou.com/plist/index?page=${offset.trim()}&json=true`);

    global.cache.set(ctx.request.url, result.data);

    ctx.rest(result.data);
}


// 导出数据
module.exports = {
    playlist_tagCategory,
    playlist_Tag,
    playlist_Info,
    playlist_list
}