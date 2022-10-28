const { default: axios } = require("axios");
const APIError = require("../../../middlewares/rest").APIError;
// 第三方加密库
const cryptoJs = require('crypto-js');


let comment = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var hash = ctx.request.query.hash || '';
        var offset = ctx.request.query.offset || '1';
        var limit = ctx.request.query.limit || '30';
        var type = ctx.request.query.type || '0';
    } else if (ctx.request.method === 'POST') {
        var hash = ctx.request.body.hash || '';
        var offset = ctx.request.body.offset || '1';
        var limit = ctx.request.body.limit || '30';
        var type = ctx.request.body.type || '0';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    if (!hash) {
        throw new APIError("argument_error", "hash is not found")
    }


    if (parseInt(limit) > 40) limit = '40';


    let k = Math.round((new Date).getTime() / 1000);


    let result = null;
    if(type == '0') {
        let md5_str = `OIlwieks28dk2k092lksi2UIkpappid=1005clienttime=${k}clienttoken=clientver=10869code=fc4be23b4e972707f36b8a828a93ba8adfid=1tSE9K4VW4ZW0299bn0Gu1bNextdata=${hash}kugouid=0mid=143773497225871101952332916871990469790p=${offset.trim()}pagesize=${limit.trim()}schash=${hash}uuid=4f3e2278033606d95d92efddc0744d9cver=10OIlwieks28dk2k092lksi2UIkp`;
        let signature = cryptoJs.MD5(md5_str);
    
        // 最多获取40条评论 最新评论
        result = await axios.post(`http://m.comment.service.kugou.com:80/r/v1/rank/newest?dfid=1tSE9K4VW4ZW0299bn0Gu1bN&mid=143773497225871101952332916871990469790&signature=${signature.toString()}&clienttime=${k}&uuid=4f3e2278033606d95d92efddc0744d9c&extdata=${hash}&appid=1005&code=fc4be23b4e972707f36b8a828a93ba8a&schash=${hash}&clientver=10869&p=${offset.trim()}&clienttoken=&pagesize=${limit.trim()}&ver=10&kugouid=0`, null, {
            headers: {
                'User-Agent': 'Android712-AndroidPhone-10869-52-0-COMMENT-wifi',
            }
        });    
    } else {
        let md5_str = `OIlwieks28dk2k092lksi2UIkpappid=1005clienttime=${k}clienttoken=clientver=10869code=fc4be23b4e972707f36b8a828a93ba8adfid=1tSE9K4VW4ZW0299bn0Gu1bNextdata=${hash}kugouid=0mid=143773497225871101952332916871990469790p=${offset.trim()}pagesize=${limit.trim()}schash=${hash}uuid=4f3e2278033606d95d92efddc0744d9cver=10OIlwieks28dk2k092lksi2UIkp`
        let signature = cryptoJs.MD5(md5_str);

        // 最多获取40条评论 最热评论
        result = await axios.post(`http://m.comment.service.kugou.com:80/r/v1/rank/topliked?dfid=1tSE9K4VW4ZW0299bn0Gu1bN&mid=143773497225871101952332916871990469790&signature=${signature.toString()}&clienttime=${k}&uuid=4f3e2278033606d95d92efddc0744d9c&extdata=${hash}&appid=1005&code=fc4be23b4e972707f36b8a828a93ba8a&schash=${hash}&clientver=10869&p=${offset.trim()}&clienttoken=&pagesize=${limit.trim()}&ver=10&kugouid=0`, null, {
            headers: {
                'User-Agent': 'Android712-AndroidPhone-10869-52-0-COMMENT-wifi',
            }
        });
    }


    global.cache.set(ctx.request.url, result ? result.data : {});

    ctx.rest(result ? result.data : {});
}




let replyComment = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var special_child_id = ctx.request.query.special_child_id || '';
        var id = ctx.request.query.id || '';
        var offset = ctx.request.query.offset || '1';
        var limit = ctx.request.query.limit || '30';
    } else if (ctx.request.method === 'POST') {
        var special_child_id = ctx.request.body.special_child_id || '';
        var id = ctx.request.body.id || '';
        var offset = ctx.request.body.offset || '1';
        var limit = ctx.request.body.limit || '30';
    }


    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    if (!special_child_id || !id) {
        throw new APIError("argument_error", "special_child_id or id is not found")
    }

    if (parseInt(limit) > 50) limit = '50';

    // 获取音乐评论 最多50条
    const result = await axios.post(`http://m.comment.service.kugou.com:80/index.php?appid=1005&uuid=4f3e2278033606d95d92efddc0744d9c&r=commentsv2/getReplyWithLike&code=fc4be23b4e972707f36b8a828a93ba8a&childrenid=${special_child_id.trim()}&kugouid=0&ver=10&clienttoken=&clientver=10869&mid=143773497225871101952332916871990469790&clienttime=1666945630&key=6bc76958b283e3901b85a75e1355f396&dfid=1tSE9K4VW4ZW0299bn0Gu1bN&tid=${id.trim()}&gitversion=2d3769c&clisource=common&p=${offset.trim()}&pagesize=${limit.trim()}&mixsongid=32100650&cmtdreturnserver=%7B%7D`, null, {
        headers: {
            'User-Agent': 'Android712-AndroidPhone-10869-52-0-COMMENT-wifi',
        }
    });

    global.cache.set(ctx.request.url, result ? result.data : {});

    ctx.rest(result ? result.data : {});
}



module.exports = {
    comment,
    replyComment
}