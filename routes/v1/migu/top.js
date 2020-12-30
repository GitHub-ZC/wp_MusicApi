const { migu_request } = require("../../../util/migu_request");

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
        '13': 'newalbum'
    };

    let result = await migu_request(`https://music.migu.cn/v3/music/top/${topList[topId]}`);

    // 排行榜正则匹配规则,官方接口默认不支持这么多接口,走爬虫
    let rule = /<script>\s{0,}var\s{0,}listData\s{0,}=\s{0,}({.*})\s{0,}<\/script>/s;
    
    try {
        // ctx.body = JSON.stringify(result.data);
        let arr = rule.exec(result.data);
        ctx.body = arr[1];
    } catch (error) {
        ctx.body = JSON.stringify({
            error: '服务端数据解析错误',
            status: 400
        })
    }
    ctx.type = 'application/json';
}

// 排行榜分类
let topCategory = async (ctx) => {
    let topList = {
        data: {
            topList: [
                {
                    topId: 1,
                    topName: '尖叫新歌榜'
                },
                {
                    topId: 2,
                    topName: '尖叫热歌榜'
                },
                {
                    topId: 3,
                    topName: '尖叫原创榜'
                },
                {
                    topId: 4,
                    topName: '音乐榜'
                },
                {
                    topId: 5,
                    topName: '影视榜'
                },
                {
                    topId: 6,
                    topName: '内地榜'
                },
                {
                    topId: 7,
                    topName: '港台榜'
                },
                {
                    topId: 8,
                    topName: '欧美榜'
                },
                {
                    topId: 9,
                    topName: '日韩榜'
                },
                {
                    topId: 10,
                    topName: '彩铃榜'
                },
                {
                    topId: 11,
                    topName: 'KTV榜'
                },
                {
                    topId: 12,
                    topName: '网络榜'
                },
                {
                    topId: 13,
                    topName: '新专辑榜'
                },
            ]
        }
    };

    try {
        ctx.body = JSON.stringify(topList);
    } catch (error) {
        ctx.body = JSON.stringify({
            error: '服务端数据解析错误',
            status: 400
        })
    }
    ctx.type = 'application/json';
}

module.exports = {
    top,
    topCategory
}