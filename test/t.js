const { default: axios } = require("axios");
const CryptoJS = require('crypto-js');


(async () => {


    let a = parseInt((new Date()).getTime() / 1000).toString();
    // a = '12412123213';
    // Encrypt
    let ciphertext = CryptoJS.AES.encrypt(a, (new Date()).getMinutes().toString() + 'QWEASDZXC');

    console.log(ciphertext.iv.toString());
    console.log(ciphertext.salt.toString());
    console.log(ciphertext.key.toString());

    console.log(CryptoJS.SHA256(a).toString());

    // try {
    //     let result = await axios.post('http://43.138.145.42:5001/v1/wy/setcookie', {
    //         data: 'NTES_P_UTID=ADCXoiSt7mER2Q9bHQUehzzFTds5r3SY|1666877170; nts_mail_user=i153140965@163.com:-1:1; _ntes_nuid=2d881a8b54b2284a6689c2c60449140d; _ntes_nnid=2d881a8b54b2284a6689c2c60449140d,1642125839709; NMTID=00OIWMmS9I0773lpk11uGYZe1GQ0AcAAAF-VlPOfw; WNMCID=qsuewa.1642125840188.01.0; WM_TID=9BYOtDLvlL5BBQAUVUMu%2BHZsMhu3Q3Bs; NTES_CMT_USER_INFO=272331503%7C%E6%9C%89%E6%80%81%E5%BA%A6%E7%BD%91%E5%8F%8B0geTbL%7Chttp%3A%2F%2Fcms-bucket.nosdn.127.net%2F2018%2F08%2F13%2F078ea9f65d954410b62a52ac773875a1.jpeg%7Cfalse%7CaTE1MzE0MDk2NUAxNjMuY29t; ntes_kaola_ad=1; __snaker__id=1Vn5NGpDXStuXuqT; _9755xjdesxxd_=32; YD00000558929251%3AWM_TID=gFt8cdPgYHBBUERFQBfVDZCUS6OxyZWH; __bid_n=183e4c63689cd43abc4207; hb_MA-B701-2FC93ACD9328_source=mail.stu.shmtu.edu.cn; P_INFO=i153140965@163.com|1666877170|0|mail163|00&99|null&null&null#shh&null#10#0#0|&0||i153140965@163.com; WM_NI=grSiwBHZ%2FCe7Hg%2Bq2gKeCjoyhobq2ucSHf%2BWlXpzAwIMNYptYu1AqcXe2R85HChBHADTr4fljr4P3HsI%2BSzZn19uaNBEKJiPqC0gYIJt0FMbcojk5BYQFUCzD0jn2UszWXk%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eea2b36d81eba990cd4d98968fb6d54f938f8aacc47087ef9697ef7bb6bd8fccd12af0fea7c3b92aa5ae9d8af64a8c86e1a4e83d8cb9e592b16d89bb8d8bee73acb1ae92b17fa18d8887aa5db088c09bc47d8b9382baf3809babffa2f4699cbbfeb3bb3f8c9da8a3cb4b888cbed5e568aaaefcb1b244b197e5b4f952aeeff796e446829b85abec5cb39d0088dc438aac00a7d06aa1b1a68cb84a9b8f8ab6c27288f0a68fb15fb1a699b9ea37e2a3; JSESSIONID-WYYY=SyZIAN%2BluMB7sT9o8hgx12nzgdBj874muxQhQHvbWCFPabJNcXKohh8kJ%2BqjxsChu%5CXlKtSllx01xauM%2BeJTBFKXaX4%5CE5%5CzmqlatxPQcVgVV%2FxG0E49%2FI5Fkzcu2%2FSMEs5s3uzo611c1qg2r4aAXWhVol2QGEDyT%5CH3eZdishv9aH9f%3A1667035526670; _iuqxldmzr_=33; gdxidpyhxdE=rZU24o7i078jcQ9BCPPn3vsbfZGlfL3OKqfUcSWZ8EItZ4p1eIYyMzcymNRuqH7qit5BnwXma68z9mS1cJBolkU0XTPQbLLeD8y%2Fd4xPdu5n67cbSBWSjrfufBtYeTtTyJwgfiCiOyJ0S78JQsVvnPB%2FxT%5CYVmWCPxRUDDLa94o%2BtKSq%3A1667034627197; YD00000558929251%3AWM_NI=dQtq3bi4fMryIvaPsZ1MmTq93vBOstFA9NyvYCaPaiMJ275DLPjUsxhzXZlgxQrRHqyxWUMG0iEBp9Lp8PNFTXAbuAK%2FIzEnv6Fzu2NI%2Fz%2FFENQYid5F%2BQhuPKO2J4EMNlA%3D; YD00000558929251%3AWM_NIKE=9ca17ae2e6ffcda170e2e6ee87bb73b09ae1a7f93da2e78bb7c85f969a8eacc55396a98397ed5a839a8790d12af0fea7c3b92aa88fbc92b26aabecaaaef1738baaafb1f252f393a3b5f433f1aa8eb0f280869ff7affc7e9b9dafb1e4638f96fed8b8509090a6b6f274aca698bbef6dbc8fbeb3cb7bbba899b6d04df4b78ba3f33390b0f8b1cd4e98888f83f84b89f1879bc866b6ea8a9bf83a8e97e19bae4e87929fbaec70f79ae5b2eb7f949581d3c9408793828dc437e2a3; __csrf=65c04c852b653455f5583577b74062e4; WEVNSM=1.0.0'
    //     }, {
    //         headers: {
    //             'imax-music': ciphertext
    //         }
    //     });
    //     console.log(result.data);
    // } catch (error) {
    //     console.log(error);
    // }


    try {
        let result = await axios.get('http://43.138.145.42:5002/v1/wy/getcookie', {
            headers: {
                'imax-music': ciphertext
            }
        });
        console.log(result.data);
    } catch (error) {
        console.log(error);
    }
})();