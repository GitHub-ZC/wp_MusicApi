const { migu_request } = require("../../../util/migu_request");
const APIError = require("../../../middlewares/rest").APIError;

// 排行榜歌单详情
let top = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var topId = ctx.request.query.topId || '27553319';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var topId = ctx.request.body.topId || '27553319';
    }


    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    const boardList = [{ id: 'mg__27553319', name: '尖叫新歌榜', bangid: '27553319', webId: 'jianjiao_newsong' }, { id: 'mg__27186466', name: '尖叫热歌榜', bangid: '27186466', webId: 'jianjiao_hotsong' }, { id: 'mg__27553408', name: '尖叫原创榜', bangid: '27553408', webId: 'jianjiao_original' }, { id: 'mg__23189800', name: '港台榜', bangid: '23189800', webId: 'hktw' }, { id: 'mg__23189399', name: '内地榜', bangid: '23189399', webId: 'mainland' }, { id: 'mg__19190036', name: '欧美榜', bangid: '19190036', webId: 'eur_usa' }, { id: 'mg__23189813', name: '日韩榜', bangid: '23189813', webId: 'jpn_kor' }, { id: 'mg__23190126', name: '彩铃榜', bangid: '23190126', webId: 'coloring' }, { id: 'mg__15140045', name: 'KTV榜', bangid: '15140045', webId: 'ktv' }, { id: 'mg__15140034', name: '网络榜', bangid: '15140034', webId: 'network' }, { id: 'mg__21958042', name: '美国iTunes榜', bangid: '21958042', webId: 'itunes' }, { id: 'mg__21975570', name: '美国billboard榜', bangid: '21975570', webId: 'billboard' }, { id: 'mg__22272815', name: '台湾Hito中文榜', bangid: '22272815', webId: 'hito' }, { id: 'mg__22272943', name: '韩国Melon榜', bangid: '22272943', webId: 'mnet' }, { id: 'mg__22273437', name: '英国UK榜', bangid: '22273437', webId: 'uk' }];

    let result = await migu_request(`https://app.c.nf.migu.cn/MIGUM2.0/v1.0/content/querycontentbyId.do?columnId=${topId}&needAll=0`);

    const list = filterData(result.data.columnInfo.contents);

    global.cache.set(ctx.request.url, {
        total: list.length,
        list,
        limit: this.limit,
        source: 'mg',
    }, 3600);

    ctx.rest({
        total: list.length,
        list,
        limit: this.limit,
        source: 'mg',
    });

    result = null;
    // topList = {
    //     '1': 'jianjiao_newsong',
    //     '2': 'jianjiao_hotsong',
    //     '3': 'jianjiao_original',
    //     // '4': 'migumusic',
    //     '4': 'movies',
    //     '5': 'mainland',
    //     '6': 'hktw',
    //     '7': 'eur_usa',
    //     '8': 'jpn_kor',
    //     '9': 'coloring',
    //     '10': 'ktv',
    //     '11': 'network',
    //     '12': 'itunes',
    //     '13': 'billboard',
    //     '14': 'hito',
    //     '15': 'mnet',
    //     '16': 'uk'
    // };

    // if(topList[topId.trim()] == undefined) {
    //     console.log('1231');
    //     throw new APIError(`miguTop:Error`, `topId is not exist`);
    // }

    // let result = await migu_request(`https://music.migu.cn/v3/music/top/${topList[topId.trim()]}`);

    // // 排行榜正则匹配规则,官方接口默认不支持这么多接口,走爬虫
    // let rule = /<script>\s{0,}var\s{0,}listData\s{0,}=\s{0,}({.*})\s{0,}<\/script>/s;

    // try {
    //     // ctx.body = JSON.stringify(result.data);
    //     let arr = rule.exec(result.data);
    //     global.cache.set(ctx.request.url, arr[1], 3600);
    //     ctx.rest(arr[1]);
    //     arr = null;
    // } catch (error) {
    //     throw new APIError("miguTop:parse_error", "Json parse error");
    // }
    // result = null;
    // ctx.type = 'application/json';
}

// 排行榜分类
let topCategory = async (ctx) => {
    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    let result = await migu_request(`https://app.c.nf.migu.cn/MIGUM3.0/v1.0/template/rank-list/release`);
    const list = filterBoardsData(result.data.data.contentItemList);

    global.cache.set(ctx.request.url, {
        list,
        source: 'mg',
    }, 3600);

    ctx.rest({
        list,
        source: 'mg',
    })
}

const filterBoardsData = (rawList) => {
    // console.log(rawList)
    let list = []
    for (const board of rawList) {
        if (board.template != 'group1') continue
        for (const item of board.itemList) {
            if ((item.template != 'row1' && item.template != 'grid1' && !item.actionUrl) || !item.actionUrl.includes('rank-info')) continue

            let data = item.displayLogId.param
            list.push({
                id: 'mg__' + data.rankId,
                name: data.rankName,
                bangid: String(data.rankId),
                songList: [item.title ? {
                    songName: item['title'].substr(2).toString().replace(new RegExp('<.*?>', 'g'), "").split(' · ')[0],
                    singerName: item['title'].substr(2).toString().replace(new RegExp('<.*?>', 'g'), "").split(' · ')[1] 
                }: null, item.subTitle ? {
                    songName: item['subTitle'].substr(2).toString().replace(new RegExp('<.*?>', 'g'), "").split(' · ')[0],
                    singerName: item['subTitle'].substr(2).toString().replace(new RegExp('<.*?>', 'g'), "").split(' · ')[1] 
                }: null, item.subTitle1 ? {
                    songName: item['subTitle1'].substr(2).toString().replace(new RegExp('<.*?>', 'g'), "").split(' · ')[0],
                    singerName: item['subTitle1'].substr(2).toString().replace(new RegExp('<.*?>', 'g'), "").split(' · ')[1] 
                }: null],
                imageUrl: item.imageUrl ? item.imageUrl: null
            })
        }
    }
    return list;
}

let getSinger = (singers) => {
    let arr = []
    singers.forEach(singer => {
        arr.push(singer.name)
    })
    return arr.join('、')
}

let filterData = (rawData) => {
    let ids = new Set()
    const list = []
    rawData.forEach(({ objectInfo: item }) => {
        if (ids.has(item.copyrightId)) return
        ids.add(item.copyrightId)

        const types = []
        const _types = {}
        item.newRateFormats && item.newRateFormats.forEach(type => {
            let size
            switch (type.formatType) {
                case 'PQ':
                    size = sizeFormate(type.size !== (null || undefined) ? type.size : type.androidSize)
                    types.push({ type: '128k', size })
                    _types['128k'] = {
                        size,
                    }
                    break
                case 'HQ':
                    size = sizeFormate(type.size !== (null || undefined) ? type.size : type.androidSize)
                    types.push({ type: '320k', size })
                    _types['320k'] = {
                        size,
                    }
                    break
                case 'SQ':
                    size = sizeFormate(type.size !== (null || undefined) ? type.size : type.androidSize)
                    types.push({ type: 'flac', size })
                    _types.flac = {
                        size,
                    }
                    break
                case 'ZQ':
                    size = sizeFormate(type.size !== (null || undefined) ? type.size : type.androidSize)
                    types.push({ type: 'flac32bit', size })
                    _types.flac32bit = {
                        size,
                    }
                    break
            }
        })

        const intervalTest = /(\d\d:\d\d)$/.test(item.length)

        list.push({
            singer: getSinger(item.artists),
            name: item.songName,
            albumName: item.album,
            albumId: item.albumId,
            songmid: item.copyrightId,
            songId: item.songId,
            copyrightId: item.copyrightId,
            source: 'mg',
            interval: intervalTest ? RegExp.$1 : null,
            img: item.albumImgs && item.albumImgs.length ? item.albumImgs[0].img : null,
            lrc: null,
            lrcUrl: item.lrcUrl,
            mrcUrl: item.mrcUrl,
            trcUrl: item.trcUrl,
            otherSource: null,
            types,
            _types,
            typeUrl: {},
        })
    })
    return list
}

const sizeFormate = size => {
    // https://gist.github.com/thomseddon/3511330
    if (!size) return '0 B'
    let units = ['B', 'KB', 'MB', 'GB', 'TB']
    let number = Math.floor(Math.log(size) / Math.log(1024))
    return `${(size / Math.pow(1024, Math.floor(number))).toFixed(2)} ${units[number]}`
}

module.exports = {
    top,
    topCategory
}




/*


let topList = {
        data: {
            topList: [
                {
                    name: '咪咕尖叫榜',
                    list: [
                        {
                            topId: 1,
                            topName: '尖叫新歌榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/02/36/20020512065402_360x360_2997.png'
                        },
                        {
                            topId: 2,
                            topName: '尖叫热歌榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/04/99/200408163640868_360x360_6587.png'
                        },
                        {
                            topId: 3,
                            topName: '尖叫原创榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/04/99/200408163702795_360x360_1614.png'
                        }
                    ]
                },
                {
                    name: '咪咕特色榜',
                    list: [
                        {
                            topId: 4,
                            topName: '音乐榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/05/136/200515161733982_360x360_1523.png'
                        },
                        {
                            topId: 5,
                            topName: '影视榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/05/136/200515161848938_360x360_673.png'
                        },
                        {
                            topId: 6,
                            topName: '内地榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/08/231/200818095104122_327x327_4971.png'
                        },
                        {
                            topId: 7,
                            topName: '港台榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/08/231/200818095125191_327x327_2382.png'
                        },
                        {
                            topId: 8,
                            topName: '欧美榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/08/231/200818095229556_327x327_1383.png'
                        },
                        {
                            topId: 9,
                            topName: '日韩榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/08/231/200818095259569_327x327_4628.png'
                        },
                        {
                            topId: 10,
                            topName: '彩铃榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/08/231/200818095356693_327x327_7955.png'
                        },
                        {
                            topId: 11,
                            topName: 'KTV榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/08/231/200818095414420_327x327_4992.png'
                        },
                        {
                            topId: 12,
                            topName: '网络榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/08/231/200818095442606_327x327_1298.png'
                        }
                    ]
                },
                {
                    name: '全球权威榜',
                    list: [
                        {
                            topId: 13,
                            topName: '美国iTunes榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/08/231/200818095755771_327x327_9250.png'
                        },
                        {
                            topId: 14,
                            topName: '美国billboard榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/08/231/20081809581365_327x327_4636.png'
                        },
                        {
                            topId: 15,
                            topName: 'Hito中文榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/08/231/200818095834912_327x327_5042.png'
                        },
                        {
                            topId: 16,
                            topName: '韩国Melon榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/08/231/200818095926828_327x327_3277.png'
                        },
                        {
                            topId: 17,
                            topName: '英国UK榜',
                            topImage: 'https://cdnmusic.migu.cn/tycms_picture/20/08/231/200818095950791_327x327_8293.png'
                        }
                    ]
                }
            ]
        }
    };

    ctx.rest(topList);
    topList = null;
    // try {
    //     ctx.body = JSON.stringify(topList);
    // } catch (error) {
    //     ctx.body = JSON.stringify({
    //         error: '服务端数据解析错误',
    //         status: 400
    //     })
    // }
    // ctx.type = 'application/json';
*/