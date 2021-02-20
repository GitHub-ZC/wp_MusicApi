const APIError = require("../../../middlewares/rest").APIError;

const ColorThief = require('colorthief');

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')

let getMasterColor = async (ctx) => {
    if (ctx.request.method === 'GET') {
        var imgUrl = ctx.request.query.imgUrl || '';
        // console.log(typeof ctx.request.query.limit, limit);
    } else if (ctx.request.method === 'POST') {
        var imgUrl = ctx.request.body.imgUrl || '';
    }

    try {
        let palette = await ColorThief.getColor(imgUrl);

        ctx.rest({color: rgbToHex(...palette)});
    } catch (error) {
        ctx.rest({color: rgbToHex(255, 255, 255)});
    }
    
}

module.exports = {
    getMasterColor
}