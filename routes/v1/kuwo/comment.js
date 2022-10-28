const { default: axios } = require("axios");
const qs = require("qs");
const APIError = require("../../../middlewares/rest").APIError;

let comment = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var id = ctx.request.query.id || '';
        var offset = ctx.request.query.offset || '1';
        var limit = ctx.request.query.limit || '30';
        var type = ctx.request.query.type || '0';
    } else if (ctx.request.method === 'POST') {
        var id = ctx.request.body.id || '';
        var offset = ctx.request.body.offset || '1';
        var limit = ctx.request.body.limit || '30';
        var type = ctx.request.body.type || '0';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    if (!id) {
        throw new APIError("argument_error", "id is not found")
    }


    let result = null;
    if (type == '0') {
        result = await axios.get(`http://comment.kuwo.cn/com.s?type=get_comment&uid=0&digest=15&sid=${id}&page=${offset}&rows=${limit}&f=web&prod=MUSIC_8.7.7.0_BCS37&devid=28556413`,
            {
                headers: {
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 9;)',
                }
            }
        );
    } else {
        result = await axios.get(`http://comment.kuwo.cn/com.s?type=get_rec_comment&uid=0&digest=15&sid=${id}&page=${offset}&rows=${limit}&f=web&prod=MUSIC_8.7.7.0_BCS37&devid=28556413`,
            {
                headers: {
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 9;)',
                }
            }
        );
    }

    global.cache.set(ctx.request.url, result ? result.data : {});

    ctx.rest(result ? result.data : {});
}




module.exports = {
    comment
}