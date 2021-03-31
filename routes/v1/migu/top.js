const { migu_request } = require("../../../util/migu_request");
const APIError = require("../../../middlewares/rest").APIError;

// 排行榜歌单详情
let top = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var topId = ctx.request.query.topId || '2';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var topId = ctx.request.body.topId || '2';
    }

    topList = {
        '1': 'jianjiao_newsong',
        '2': 'jianjiao_hotsong',
        '3': 'jianjiao_original',
        '4': 'migumusic',
        '5': 'movies',
        '6': 'mainland',
        '7': 'hktw',
        '8': 'eur_usa',
        '9': 'jpn_kor',
        '10': 'coloring',
        '11': 'ktv',
        '12': 'network',
        '13': 'itunes',
        '14': 'billboard',
        '15': 'hito',
        '16': 'mnet',
        '17': 'uk'
    };

    let result = await migu_request(`https://music.migu.cn/v3/music/top/${topList[topId.trim()]}`);

    // 排行榜正则匹配规则,官方接口默认不支持这么多接口,走爬虫
    let rule = /<script>\s{0,}var\s{0,}listData\s{0,}=\s{0,}({.*})\s{0,}<\/script>/s;
    
    
    try {
        // ctx.body = JSON.stringify(result.data);
        let arr = rule.exec(result.data);
        ctx.rest(arr[1]);
        arr = null;
    } catch (error) {
        throw new APIError("Top:parse_error", "Json parse error");
    }
    result = null;
    // ctx.type = 'application/json';
}

// 排行榜分类
let topCategory = async (ctx) => {
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
}

module.exports = {
    top,
    topCategory
}