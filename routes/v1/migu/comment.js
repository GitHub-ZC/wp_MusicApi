const { default: axios } = require("axios");
const { migu_request } = require("../../../util/migu_request");
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

    if (parseInt(limit) > 50) limit = '50';


    let result = null;
    if (type == '0') {
        result = await migu_request(`https://music.migu.cn/v3/api/comment/listComments?targetId=${id}&pageSize=${limit}&pageNo=${offset}`);
    } else {
        result = await migu_request(`https://music.migu.cn/v3/api/comment/listTopComments?targetId=${id}&pageSize=${limit}&pageNo=${offset}`);
    }

    global.cache.set(ctx.request.url, result ? result.data : {});

    ctx.rest(result ? result.data : {});
}




let replyComment = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var commentId = ctx.request.query.commentId || '';
        var offset = ctx.request.query.offset || '1';
        var limit = ctx.request.query.limit || '30';
    } else if (ctx.request.method === 'POST') {
        var commentId = ctx.request.body.commentId || '';
        var offset = ctx.request.body.offset || '1';
        var limit = ctx.request.body.limit || '30';
    }


    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    if (!commentId) {
        throw new APIError("argument_error", "commentId is not found")
    }

    if (parseInt(limit) > 50) limit = '50';


    const result = await migu_request(`https://music.migu.cn/v3/api/comment/listCommentsById?commentId=${commentId}&pageSize=${limit}&pageNo=${offset}`);

    global.cache.set(ctx.request.url, result ? result.data : {});

    ctx.rest(result ? result.data : {});
}





module.exports = {
    comment,
    replyComment
}