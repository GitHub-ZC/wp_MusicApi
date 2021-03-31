const { inflate } = require('zlib');
const iconv = require('iconv-lite');

const handleInflate = data => new Promise((resolve, reject) => {
    inflate(data, (err, result) => {
        if (err) return reject(err)
        resolve(result)
    })
})

const buf_key = Buffer.from('yeelion')
const buf_key_len = buf_key.length

const decodeLyric = async (buf, isGetLyricx) => {
    // const info = buf.slice(0, index).toString()
    // if (!info.startsWith('tp=content')) return null
    // const isLyric = info.includes('\r\nlrcx=0\r\n')
    if (buf.toString('utf8', 0, 10) != 'tp=content') return ''
    // const index = buf.indexOf('\r\n\r\n') + 4
    const lrcData = await handleInflate(buf.slice(buf.indexOf('\r\n\r\n') + 4))

    if (!isGetLyricx) return iconv.decode(lrcData, 'gb18030')

    const buf_str = Buffer.from(lrcData.toString(), 'base64')
    const buf_str_len = buf_str.length
    const output = new Uint16Array(buf_str_len)
    let i = 0
    while (i < buf_str_len) {
        let j = 0
        while (j < buf_key_len && i < buf_str_len) {
            output[i] = buf_str[i] ^ buf_key[j]
            i++
            j++
        }
    }

    return iconv.decode(Buffer.from(output), 'gb18030')
}


const enc_key = Buffer.from([0x40, 0x47, 0x61, 0x77, 0x5e, 0x32, 0x74, 0x47, 0x51, 0x36, 0x31, 0x2d, 0xce, 0xd2, 0x6e, 0x69], 'binary')
const decodeKgLyric = str => new Promise((resolve, reject) => {
    if (!str.length) return
    const buf_str = Buffer.from(str, 'base64').slice(4)
    for (let i = 0, len = buf_str.length; i < len; i++) {
        buf_str[i] = buf_str[i] ^ enc_key[i % 16]
    }
    inflate(buf_str, (err, result) => {
        if (err) return reject(err)
        resolve(result.toString())
    })
})

module.exports = {
    decodeKwLyric: async ({ lrcBase64, isGetLyricx }) => {
        const lrc = await decodeLyric(Buffer.from(lrcBase64, 'base64'), isGetLyricx);
        return Buffer.from(lrc).toString('base64');
    },
    decodeKgLyric
}