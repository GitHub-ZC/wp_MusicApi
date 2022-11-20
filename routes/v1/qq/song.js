const { qq_request } = require("../../../util/qq_request");
const APIError = require("../../../middlewares/rest").APIError;


let song = async (ctx) => {

    if (ctx.request.method === 'GET') {
        var mid = ctx.request.query.mid || '002mZevo3wHvsc';
        var br = ctx.request.query.br || '128';
    } else if (ctx.request.method === 'POST') {
        var mid = ctx.request.body.mid || '002mZevo3wHvsc';
        var br = ctx.request.body.br || '320';
    }


    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }


    let uin = global.qq_cookie.uin || '0';

    let typeMap = {
        'm4a': {
            's': 'C400',
            'e': '.m4a',
        },
        '128': {
            's': 'M500',
            'e': '.mp3',
        },
        '320': {
            's': 'M800',
            'e': '.mp3',
        },
        'ape': {
            's': 'A000',
            'e': '.ape',
        },
        'flac': {
            's': 'F000',
            'e': '.flac',
        },
        'mflac': {
            's': 'F0M0',
            'e': '.mflac',
        },
        'Hi-Res': {
            's': 'RS01',
            'e': '.flac',
        }
    }

    if (typeMap[br] === undefined) {
        throw new APIError("Song:br_error", "br is not m4a, 128, 320, flac, mflac, Hi-Res");
    }
    

    let filename = mid.split(",").filter(e => String(e).trim()).map(id => `"${typeMap[br].s}${id.trim() + id.trim()}${typeMap[br].e}"`).join(",");
    let mids = mid.split(",").filter(e => String(e).trim()).map(id => `"${id.trim()}"`).join(",");
    
    // let filename = `"${typeMap[br].s}${mid.trim() + mid.trim()}${typeMap[br].e}"`;
    // let mids = `"${mid.trim()}"`;

    let result = await qq_request(`https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&data={"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"658650575","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"filename":[${filename}],"guid":"658650575","songmid":[${mids}],"songtype":[0],"uin":"${uin}","loginflag":1,"platform":"20"}},"comm":{"uin":${uin},"format":"json","ct":24,"cv":0}}`);
    // console.log(result);
    // 捕获序列化json出错，防止程序异常退出


    let arrUrls = [];
    result.data.req_0.data.midurlinfo.length && result.data.req_0.data.midurlinfo.forEach(e => {
        arrUrls.push(e.purl ? 'https://isure.stream.qqmusic.qq.com/' + e.purl : null);
    });

    if (result.data.req_0.data.midurlinfo.length && result.data.req_0.data.midurlinfo[0].purl) {
        global.cache.set(ctx.request.url, {
            data: {
                // url: result.data.req_0.data.midurlinfo.length && result.data.req_0.data.midurlinfo[0].purl ? 'https://isure.stream.qqmusic.qq.com/' + result.data.req_0.data.midurlinfo[0].purl : null
                url: arrUrls.length === 1 ? arrUrls[0] : arrUrls
            },
            code: "成功"
        });
    }


    ctx.rest({
        data: {
            // url: result.data.req_0.data.midurlinfo.length && result.data.req_0.data.midurlinfo[0].purl ? 'https://isure.stream.qqmusic.qq.com/' + result.data.req_0.data.midurlinfo[0].purl : null
            url: arrUrls.length === 1 ? arrUrls[0] : arrUrls
        },
        code: "成功"
    });
    // ctx.rest(result.data);
    result = null;
}


// let songInfo = async (ctx) => {

//     if (ctx.request.method === 'GET') {
//         var rid = ctx.request.query.rid || '156483846';
//     } else if (ctx.request.method === 'POST') {
//         var rid = ctx.request.body.rid || '156483846';
//     }

//     let result = await qq_request('http://kuwo.cn/api/www/music/musicInfo', {
//         mid: rid.trim(),
//         httpsStatus: 1,
//         reqId: 'e3f36a20-4c05-11eb-b0b7-8b03aa7e4b0d'
//     });

//     ctx.rest(result.data);
// }

module.exports = {
    song
    // songInfo
}