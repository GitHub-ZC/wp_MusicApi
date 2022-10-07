// const { qq_request } = require("../../../util/qq_request");
const APIError = require("../../../middlewares/rest").APIError;
const { default: axios } = require("axios");
const qs = require('qs')


const { createCipheriv, createDecipheriv, publicEncrypt, randomBytes, createHash, constants } = require('crypto');
const iv = Buffer.from('0102030405060708')
const presetKey = Buffer.from('0CoJUm6Qyw8W8jud')
const linuxapiKey = Buffer.from('rFgB&h#%2?^eDg:Q')
const base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const publicKey = '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB\n-----END PUBLIC KEY-----'
const eapiKey = 'e82ckenh8dichen8'


const aesEncrypt = (buffer, mode, key, iv) => {
    const cipher = createCipheriv(mode, key, iv)
    return Buffer.concat([cipher.update(buffer), cipher.final()])
}

const aesDecrypt = function (cipherBuffer, mode, key, iv) {
    let decipher = createDecipheriv(mode, key, iv)
    return Buffer.concat([decipher.update(cipherBuffer), decipher.final()])
}

const rsaEncrypt = (buffer, key) => {
    buffer = Buffer.concat([Buffer.alloc(128 - buffer.length), buffer])
    return publicEncrypt({ key, padding: constants.RSA_NO_PADDING }, buffer)
}


const linuxapi = object => {
    const text = JSON.stringify(object)
    return {
        eparams: aesEncrypt(Buffer.from(text), 'aes-128-ecb', linuxapiKey, '').toString('hex').toUpperCase(),
    }
}


const weapi = object => {
    const text = JSON.stringify(object)
    const secretKey = randomBytes(16).map(n => (base62.charAt(n % 62).charCodeAt()))
    return {
        params: aesEncrypt(Buffer.from(aesEncrypt(Buffer.from(text), 'aes-128-cbc', presetKey, iv).toString('base64')), 'aes-128-cbc', secretKey, iv).toString('base64'),
        encSecKey: rsaEncrypt(secretKey.reverse(), publicKey).toString('hex'),
    }
}





let playlist_Info = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var pid = ctx.request.query.pid || '';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var pid = ctx.request.body.pid || '';
    }

    const cacheData = global.cache.get(ctx.request.url);
    if (cacheData) {
        ctx.rest(cacheData);
        return;
    }

    if (pid.length === 0) {
        throw new APIError("WY_playlist", "pid not found");
    }

    let a = linuxapi({
        method: 'POST',
        url: 'https://music.163.com/api/v3/playlist/detail',
        params: {
            id: pid,
            n: 100000,
            s: 8
        },
    })



    const listDetail = await axios.post('https://music.163.com/api/linux/forward', qs.stringify(a), {
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
            // Cookie: this.cookie,
        },
    });

    // console.log(JSON.stringify(listDetail.data));
    if(parseInt(listDetail.data.code) !== 200) {
        throw new APIError("PlayList_Error", listDetail.data.message);
    }
    let ids =
        listDetail.data.playlist.trackIds.map(trackId => trackId.id);

    let data = weapi({
        c: '[' + ids.map(id => ('{"id":' + id + '}')).join(',') + ']',
        ids: '[' + ids.join(',') + ']',
    });
    let result = await axios.post('https://music.163.com/weapi/v3/song/detail', qs.stringify(
        data
    ), {
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
            origin: 'https://music.163.com'
        }
    });

    global.cache.set(ctx.request.url, result.data);
    
    ctx.rest(result.data);
    result = null;
}

module.exports = {
    playlist_Info
}