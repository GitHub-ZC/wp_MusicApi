const axios = require('axios');
const { APIError } = require('../middlewares/rest');

/**
 * @author ZC
 * @param {string} url 
 * @param {*} _params 
 * @param {number} platform 0: 移动端 1： web 
 * @returns 
 */
let kuwo_request = async (url, _params, platform = 1) => {
    let result = {};
    try {
        if(platform) {
            if (_params !== undefined && _params !== null) {
                result = await axios.get(url, {
                    params: _params,
                    headers: {
                        Cookie: 'kw_token=8PAW508TG7P; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1657874945; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1657874945; _ga=GA1.2.259677078.1657874945; _gid=GA1.2.2034977564.1657874945; _gat=1',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
                        csrf: '8PAW508TG7P',
                        Referer: 'https://www.kuwo.cn/'
                        //Host: 'www.kuwo.cn'
                    }
                });
                    // console.log(JSON.stringify(result.data));
            } else {
                result = await axios.get(url, {
                    headers: {
                        Cookie: 'kw_token=8PAW508TG7P; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1657874945; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1657874945; _ga=GA1.2.259677078.1657874945; _gid=GA1.2.2034977564.1657874945; _gat=1',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
                        csrf: '8PAW508TG7P',
                        Referer: 'https://www.kuwo.cn/'
                        //Host: 'www.kuwo.cn'
                    }
                });
            }
        } else {
            if (_params !== undefined && _params !== null) {
                result = await axios.get(url, {
                    params: _params,
                    headers: {
                        Cookie: 'Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1657876915; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1657876931; BAIDU_RANDOM=pFKSJDzBnYHtp7YhcR6FYrTymh3TctAr',
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36',
                        Token: '2A6CCCFDBE1879BED52B3EFB1D21330A',
                        Referer: 'http://m.kuwo.cn/newh5app/'
                        //Host: 'm.kuwo.cn'
                    }
                });
                    // console.log(JSON.stringify(result.data));
            } else {
                result = await axios.get(url, {
                    headers: {
                        Cookie: 'Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1657876915; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1657876931; BAIDU_RANDOM=pFKSJDzBnYHtp7YhcR6FYrTymh3TctAr',
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36',
                        Token: '2A6CCCFDBE1879BED52B3EFB1D21330A',
                        Referer: 'http://m.kuwo.cn/newh5app/'
                        //Host: 'm.kuwo.cn'
                    }
                });
            }
        }
    } catch (error) {
        // console.warn(error);
        throw new APIError('Request:Request_error', 'Request is error, please recover');
    }

    return result;
}

module.exports = {
    kuwo_request
}