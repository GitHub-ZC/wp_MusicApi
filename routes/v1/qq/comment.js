const { default: axios } = require("axios");
const qs = require("qs");
const APIError = require("../../../middlewares/rest").APIError;

const emojis = {
    e400846: '😘',
    e400874: '😴',
    e400825: '😃',
    e400847: '😙',
    e400835: '😍',
    e400873: '😳',
    e400836: '😎',
    e400867: '😭',
    e400832: '😊',
    e400837: '😏',
    e400875: '😫',
    e400831: '😉',
    e400855: '😡',
    e400823: '😄',
    e400862: '😨',
    e400844: '😖',
    e400841: '😓',
    e400830: '😈',
    e400828: '😆',
    e400833: '😋',
    e400822: '😀',
    e400843: '😕',
    e400829: '😇',
    e400824: '😂',
    e400834: '😌',
    e400877: '😷',
    e400132: '🍉',
    e400181: '🍺',
    e401067: '☕️',
    e400186: '🥧',
    e400343: '🐷',
    e400116: '🌹',
    e400126: '🍃',
    e400613: '💋',
    e401236: '❤️',
    e400622: '💔',
    e400637: '💣',
    e400643: '💩',
    e400773: '🔪',
    e400102: '🌛',
    e401328: '🌞',
    e400420: '👏',
    e400914: '🙌',
    e400408: '👍',
    e400414: '👎',
    e401121: '✋',
    e400396: '👋',
    e400384: '👉',
    e401115: '✊',
    e400402: '👌',
    e400905: '🙈',
    e400906: '🙉',
    e400907: '🙊',
    e400562: '👻',
    e400932: '🙏',
    e400644: '💪',
    e400611: '💉',
    e400185: '🎁',
    e400655: '💰',
    e400325: '🐥',
    e400612: '💊',
    e400198: '🎉',
    e401685: '⚡️',
    e400631: '💝',
    e400768: '🔥',
    e400432: '👑',
}


let comment = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var id = ctx.request.query.id || '';
        var offset = ctx.request.query.offset || '1';
        var limit = ctx.request.query.limit || '30';
        var type = ctx.request.query.type || '0';
        var biztype = ctx.request.query.biztype || '1';
    } else if (ctx.request.method === 'POST') {
        var id = ctx.request.body.id || '';
        var offset = ctx.request.body.offset || '1';
        var limit = ctx.request.body.limit || '30';
        var type = ctx.request.body.type || '0';
        var biztype = ctx.request.body.biztype || '1';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    if(!id) {
        throw new APIError("argument_error", "id is not found")
    }

    if(parseInt(limit) > 25) limit = '25';


    const result = await axios.post('http://c.y.qq.com/base/fcgi-bin/fcg_global_comment_h5.fcg',
        qs.stringify({
            biztype,
            topid: id,
            LoginUin: global.qq_cookie.uin ? global.qq_cookie.uin : '0',
            cmd: {
                1: ['8', '6'], // 歌曲
                2: ['8', '9'], // 专辑
                3: ['8', '9'], // 歌单
                4: ['8', '9'], // 排行榜
                5: ['8', '6'], // mv
            }[biztype][type],
            pagenum: parseInt(offset) - 1,
            pagesize: parseInt(limit),
        })
    );

    const comment = result.data.comment;

    global.cache.set(ctx.request.url, {
        comments: filterComment(comment.commentlist),
        total: comment.commenttotal,
        offset,
        limit,
        maxOffset: Math.ceil(comment.commenttotal / limit) || 1,
    });

    ctx.rest({
        comments: filterComment(comment.commentlist),
        total: comment.commenttotal,
        offset,
        limit,
        maxOffset: Math.ceil(comment.commenttotal / limit) || 1,
    });
}


function replaceEmoji(msg) {
    let rxp = /^\[em\](e\d+)\[\/em\]$/
    let result = msg.match(/\[em\]e\d+\[\/em\]/g)
    if (!result) return msg
    result = Array.from(new Set(result))
    for (let item of result) {
        let code = item.replace(rxp, '$1')
        msg = msg.replace(new RegExp(item.replace('[em]', '\\[em\\]').replace('[/em]', '\\[\\/em\\]'), 'g'), emojis[code] || '')
    }
    return msg
}

function filterComment(rawList) {
    return rawList.map(item => {
        let time = String(item.time).length < 10 ? null : parseInt(item.time + '000')
        if (item.middlecommentcontent) {
            let firstItem = item.middlecommentcontent[0]
            firstItem.avatarurl = item.avatarurl
            firstItem.praisenum = item.praisenum
            item.avatarurl = null
            item.praisenum = null
            item.middlecommentcontent.reverse()
        }
        return {
            id: `${item.rootcommentid}_${item.commentid}`,
            rootId: item.rootcommentid,
            text: item.rootcommentcontent ? replaceEmoji(item.rootcommentcontent).replace(/\\n/g, '\n').split('\n') : [],
            time: item.rootcommentid == item.commentid ? time : null,
            userName: item.rootcommentnick ? item.rootcommentnick.substring(1) : '',
            avatar: item.avatarurl,
            userId: item.encrypt_rootcommentuin,
            likedCount: item.praisenum,
            reply: item.middlecommentcontent
                ? item.middlecommentcontent.map(c => {
                    // let index = c.subcommentid.lastIndexOf('_')
                    return {
                        id: `sub_${item.rootcommentid}_${c.subcommentid}`,
                        text: replaceEmoji(c.subcommentcontent).replace(/\\n/g, '\n').split('\n'),
                        time: c.subcommentid == item.commentid ? time : null,
                        userName: c.replynick.substring(1),
                        avatar: c.avatarurl,
                        userId: c.encrypt_replyuin,
                        likedCount: c.praisenum,
                    }
                })
                : [],
        }
    })
}

module.exports = {
    comment
}