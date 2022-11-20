const { default: axios } = require("axios");
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

    let result = await kugou_request(`http://www2.kugou.kugou.com/yueku/v9/special/single/${pid}-6-1084.html`);

    // 正则匹配
    let listData = regExps.listData.exec(result.data);
    let listInfo = regExps.listInfo.exec(result.data);
    // let listDetailLink = regExps.listDetailLink.exec(result.data);

    // console.log(listDetailLink);
    // console.log(listInfo[1]);
    // console.log(listData[1]);

    global.cache.set(ctx.request.url, {
        code: 'success',
        msg: 'playlist Info',
        name: listInfo[1] ? listInfo[1] : '',
        picurl: listInfo[2] ? listInfo[2] : '',
        listData: listData[1] ? JSON.parse(listData[1]) : null
        // listDetailLink: JSON.parse(listDetailLink[1])
    });

    ctx.rest({
        code: 'success',
        msg: 'playlist Info',
        name: listInfo[1] ? listInfo[1] : '',
        picurl: listInfo[2] ? listInfo[2] : '',
        listData: listData[1] ? JSON.parse(listData[1]) : null
        // listDetailLink: JSON.parse(listDetailLink[1])
    })
}


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



//外部导入歌单 => 酷狗码（只支持500首） PC
let playlist_import = async (ctx) => {

    if (ctx.request.method === 'GET') {
        var id = ctx.request.query.id || '';
    } else if (ctx.request.method === 'POST') {
        var id = ctx.request.body.id || '';
    }

    if (id.trim() === '') {
        throw new APIError("Playlist:Error", "id is not found");
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }


    let res = await axios.post(`http://t.kugou.com/command/`, {
        "appid": 1001,
        "clientver": 9020,
        "mid": "21511157a05844bd085308bc76ef3343",
        "clienttime": 640612895,
        "key": "36164c4015e704673c588ee202b9ecb8",
        "data": id
    });

    if (res.status === 200 && res.data.status === 1) {
        let data = res.data.data;
        let response = await axios.post(`http://www2.kugou.kugou.com/apps/kucodeAndShare/app/`, {
            "appid": 1001,
            "clientver": 10112,
            "mid": "70a02aad1ce4648e7dca77f2afa7b182",
            "clienttime": 722219501,
            "key": "381d7062030e8a5a94cfbe50bfe65433",
            "data": {
                "id": data.info.id,
                "type": 3,
                "userid": data.info.userid,
                "collect_type": data.info.collect_type,
                "page": 1,
                "pagesize": data.info.count
            }
        });

        if (response.status === 200 && response.data.status === 1) {
            let resource = [];
            response.data.data.forEach(song => {
                resource.push({
                    "album_audio_id": 0,
                    "album_id": "0",
                    "hash": song.hash,
                    "id": 0,
                    "name": song.filename.replace(".mp3", ""),
                    "page_id": 0,
                    "type": "audio"
                });
            });

            let postData = {
                "appid": 1001,
                "area_code": "1",
                "behavior": "play",
                "clientver": "10112",
                "dfid": "2O3jKa20Gdks0LWojP3ly7ck",
                "mid": "70a02aad1ce4648e7dca77f2afa7b182",
                "need_hash_offset": 1,
                "relate": 1,
                resource,
                "token": "",
                "userid": "0",
                "vip": 0
            }


            var result = await axios.post(`https://gateway.kugou.com/v2/get_res_privilege/lite?appid=1001&clienttime=1668883879&clientver=10112&dfid=2O3jKa20Gdks0LWojP3ly7ck&mid=70a02aad1ce4648e7dca77f2afa7b182&userid=390523108&uuid=92691C6246F86F28B149BAA1FD370DF1`, postData, {
                headers: {
                    "x-router": "media.store.kugou.com"
                }
            });

            if (response.status === 200 && response.data.status === 1) {
                result.data.data.forEach(song => {
                    if (!song.relate_goods || !song.relate_goods.length) return;
                    song.image = song.info.image.replace("{size}", "400");
                    delete song.info;
                    delete song.hash;
                    song.relate_goods.forEach((element, index) => {
                        switch (index) {
                            case 0:
                                song.FileHash = element.hash;
                                song.FileSize = element.info.filesize;
                                song.ExtName = element.info.extname;
                                break;
                            case 1:
                                song.HQFileSize = element.hash;
                                song.HQFileSize = element.info.filesize;
                                song.HQExtName = element.info.extname;
                                break;
                            case 2:
                                song.SQFileHash = element.hash;
                                song.SQFileSize = element.info.filesize;
                                song.SQExtName = element.info.extname;
                                break;
                            case 3:
                                song.ResFileHash = element.hash;
                                song.ResFileSize = element.info.filesize;
                                song.ResExtName = element.info.extname;
                                break;
                            case 4:
                                song.MvHash = element.hash;
                                song.MvHash = element.info.filesize;
                                song.MvExtName = element.info.extname;
                                break;
                        }
                    });
                    delete song.relate_goods;
                });
            }
        }
    }



    if (!result) {
        throw new APIError("Playlist:Error", "result is not found");
    }

    global.cache.set(ctx.request.url, result.data);

    ctx.rest(result.data);
}

module.exports = {
    playlist_tagCategory,
    playlist_Tag,
    playlist_Info,
    playlist_list,
    playlist_import
}