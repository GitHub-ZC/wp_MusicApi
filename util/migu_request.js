const axios = require('axios');
const __Cookie = require('./cookie_util');

let migu_request = async (url, _params) => {
    let result = {};
    try {
        if (_params !== undefined) {
            result = await axios.get(url, {
                params: _params,
                headers: {
                    Referer: 'https://m.music.migu.cn/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
                    Cookie: __Cookie.serialization(global.migu_cookie)
                }
            });
        } else {
            result = await axios.get(url, {
                headers: {
                    Referer: 'https://m.music.migu.cn/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
                    Cookie: __Cookie.serialization(global.migu_cookie)
                }
            });
        }
    } catch (error) {
        throw new APIError('Request:Request_error', 'Request is error, please recover');
    }

    return result;
}

module.exports = {
    migu_request
}