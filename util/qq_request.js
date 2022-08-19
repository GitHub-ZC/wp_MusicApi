const axios = require('axios');
const { APIError } = require('../middlewares/rest');
const __Cookie = require('./cookie_util');


let qq_request = async (url, _params) => {
    let result = {};
    // console.log(__Cookie.serialization(global.qq_cookie), '!!!');
    try {
        if (_params !== undefined) {
            result = await axios.get(url, {
                params: _params,
                headers: {
                    // Cookie: 'Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1609307382; _ga=GA1.2.93241344.1609307382; _gid=GA1.2.1348073384.1609307382; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1609420898; _gat=1; kw_token=95MWTYC4FP',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0',
                    Referer: 'https://y.qq.com/',
                    Host: 'u.y.qq.com',
                    TE: 'trailers',
                    // Origin: 'https://y.qq.com/',
                    Cookie: __Cookie.serialization(global.qq_cookie)
                }
            });
        } else {
            result = await axios.get(url, {
                headers: {
                    // Cookie: 'Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1609307382; _ga=GA1.2.93241344.1609307382; _gid=GA1.2.1348073384.1609307382; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1609420898; _gat=1; kw_token=95MWTYC4FP',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0',
                    Referer: 'https://y.qq.com/',
                    Host: 'u.y.qq.com',
                    TE: 'trailers',
                    // Origin: 'https://y.qq.com/',
                    Cookie: __Cookie.serialization(global.qq_cookie)
                }
            });
        }
    } catch (error) {
        // console.log(error);
        throw new APIError('Request:Request_error', 'Request is error, please recover');
    }
    // console.log(__Cookie.serialization(global.qq_cookie));
    return result;
}

module.exports = {
    qq_request
}