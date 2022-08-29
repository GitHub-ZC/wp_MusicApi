const Router = require('koa-router');
const fs = require("fs");
const path = require('path');

const index = new Router();

index.get('/', async (ctx) => {
    const html = fs.readFileSync(path.join(__dirname, "./index.html"));
    // console.log(__dirname);
    ctx.response.type = 'text/html;charset=UTF-8';
    ctx.response.body = html;
})

module.exports = index;