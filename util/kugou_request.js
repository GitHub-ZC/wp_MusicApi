const axios = require('axios');
const { APIError } = require('../middlewares/rest');
const __Cookie = require('./cookie_util');




userAgent = [
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; 360SE)',
    'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11',
    'MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
    'Mozilla/5.0 (Linux; U; Android 3.0; en-us; Xoom Build/HRI39) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13',
    'NOKIA5700/ UCWEB7.0.2.37/28/999',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0;',
    'MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; TencentTraveler 4.0; .NET CLR 2.0.50727)'
]



let kugou_request = async (url, _params, flag = 1) => {
    let result = {};
    try {
        if (_params !== undefined) {
            result = await axios.get(url, {
                params: _params,
                headers: flag ? { 
                    // Cookie: 'Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1609307382; _ga=GA1.2.93241344.1609307382; _gid=GA1.2.1348073384.1609307382; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1609420898; _gat=1; kw_token=95MWTYC4FP',
                    'User-Agent': userAgent[parseInt(Math.random() * 10)],
                    Referer: 'https://www.kugou.com/',
                    Cookie: __Cookie.serialization(global.kugou_cookie),
                    //Host: 'wwwapi.kugou.com'
                } : {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0',
                    Referer: 'https://www.kugou.com/',
                }
            });
        } else {
            result = await axios.get(url, {
                headers: {
                    // Cookie: 'Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1609307382; _ga=GA1.2.93241344.1609307382; _gid=GA1.2.1348073384.1609307382; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1609420898; _gat=1; kw_token=95MWTYC4FP',
                    Cookie: __Cookie.serialization(global.kugou_cookie),
                    'User-Agent': userAgent[parseInt(Math.random() * 10)],
                    Referer: 'https://www.kugou.com/',
                    dfid: '1ssiv93oVqMp27cirf2CvoF1',
                    mid: '156798703528610303473757548878786007104',
                    clienttime: 1584257267,
                    'x-router': 'msearch.kugou.com',
                    'user-agent': 'Android9-AndroidPhone-10020-130-0-searchrecommendprotocol-wifi',
                    'kg-rc': 1
                }
            });
        }
    } catch (error) {
        throw new APIError('Request:Request_error', 'Request is error, please recover');
    }

    return result;
}

module.exports = {
    kugou_request
}