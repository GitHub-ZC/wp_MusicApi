const axios = require('axios');

let migu_request = async (url, _params) => {
    let result = null;
    if (_params != undefined) {
        result = await axios.get(url, {
            params: _params,
            headers: {
                Referer: 'https://m.music.migu.cn/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0'
            }
        });
    } else {
        result = await axios.get(url, {
            headers: {
                Referer: 'https://m.music.migu.cn/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0'
            }
        });
    }
    return result;
}

module.exports = {
    migu_request
}