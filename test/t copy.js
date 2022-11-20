const { default: axios } = require("axios");
const CryptoJS = require('crypto-js');


(async () => {


    let a = parseInt((new Date()).getTime()).toString();

    var words = CryptoJS.enc.Utf8.parse("SGVsbG8ssdfadfIFdvcmxQSGVsbG8ssd");
    var iv = CryptoJS.enc.Utf8.parse("1011121314151617");

    var encrypted = CryptoJS.AES.encrypt(a, words , {iv});

    try {
        let result = await axios.get('http://42.192.118.65:5100/aggregate/search?key=%E8%AE%B8%E5%B5%A9&offset=1', {
            headers: {
                'imax-music': encrypted.toString()
            }
        });
        console.log(result.data);
    } catch (error) {
        console.log(error);
    }

    try {
        let result = await axios.get('http://42.192.118.65:5100/kugou/song?hash=A1105CC90AF7168721E805E4ADED8F7A', {
            headers: {
                'imax-music': encrypted.toString()
            }
        });
        console.log(result.data);
    } catch (error) {
        console.log(error);
    }

    try {
        // 酷我br  {24, 48, 96, 128, 192, 320, ape, flac, hires}
        let result = await axios.get('http://42.192.118.65:5100/kuwo/song?id=213671654&br=hires', {
            headers: {
                'imax-music': encrypted.toString()
            }
        });
        console.log(result.data);
    } catch (error) {
        console.log(error);
    }
})();