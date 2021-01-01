const axios = require("axios");


// (async () => {
//     let result = await axios.get("http://kuwo.cn/api/www/search/searchMusicBykeyWord", {
//         params: {
//             key: '许嵩',
//             pn: 1,
//             rn: 30,
//             httpsStatus: 1,
//             reqId: '69aea0f0-4b6e-11eb-96b8-45ff05ac6a0e'
//         },
//         headers: {
//             Cookie: 'Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1609307382; _ga=GA1.2.93241344.1609307382; _gid=GA1.2.1348073384.1609307382; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1609420898; _gat=1; kw_token=95MWTYC4FP',
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
//             csrf: '95MWTYC4FP',
//             Referer: 'http://kuwo.cn/'
//         }
//     });
//     console.log(JSON.stringify(result.data));
// })();

// (async () => {
//     let result = await axios.get("http://kuwo.cn/api/www/bang/bang/musicList", {
//         params: {
//             bangId: 16,
//             pn: 1,
//             rn: 30,
//             httpsStatus: 1,
//             reqId: '69aea0f0-4b6e-11eb-96b8-45ff05ac6a0e'
//         },
//         headers: {
//             Cookie: 'Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1609307382; _ga=GA1.2.93241344.1609307382; _gid=GA1.2.1348073384.1609307382; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1609420898; _gat=1; kw_token=95MWTYC4FP',
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
//             csrf: '95MWTYC4FP',
//             Referer: 'http://kuwo.cn/'
//         }
//     });
//     console.log(JSON.stringify(result.data));
// })();

(async () => {
    let result = await axios.get("http://kuwo.cn/url", {
        params: {
            br: '1000kape',
            type: 'convert_url3',
            rid: 156483846
        },
        headers: {
            Cookie: 'Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1609307382; _ga=GA1.2.93241344.1609307382; _gid=GA1.2.1348073384.1609307382; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1609420898; _gat=1; kw_token=95MWTYC4FP',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
            csrf: '95MWTYC4FP',
            Referer: 'http://kuwo.cn/'
        }
    });
    console.log(JSON.stringify(result.data));
})();