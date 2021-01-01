const axios = require('axios');

let kuwo_request = async (url, _params) => {
    let result = {};
    try {
        if (_params !== undefined) {
            result = await axios.get(url, {
                params: _params,
                headers: {
                    Cookie: 'Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1609307382; _ga=GA1.2.93241344.1609307382; _gid=GA1.2.1348073384.1609307382; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1609420898; _gat=1; kw_token=95MWTYC4FP',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
                    csrf: '95MWTYC4FP',
                    Referer: 'http://kuwo.cn/'
                }
            });
                // console.log(JSON.stringify(result.data));
        } else {
            result = await axios.get(url, {
                headers: {
                    Cookie: 'Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1609307382; _ga=GA1.2.93241344.1609307382; _gid=GA1.2.1348073384.1609307382; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1609420898; _gat=1; kw_token=95MWTYC4FP',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
                    csrf: '95MWTYC4FP',
                    Referer: 'http://kuwo.cn/'
                }
            });
        }
    } catch (error) {
        result.data = {
            error: '请求酷我服务器失败，请检查本地网络或者联系管理员',
            status: 400
        }
    }

    return result;
}

module.exports = {
    kuwo_request
}