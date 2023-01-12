// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
// 注意require('koa-router')返回的是函数:
const v1 = require('./routes/v1/controllers');
const index = require('./public/controllers');
// 解析request的body的功能
const koaBody = require("koa-body");
// 异常捕获
const { restify } = require('./middlewares/rest');
const { validation } = require('./middlewares/auth');

const Cache = require('./util/cache');

const cors = require('koa2-cors');

// 自定义库
const config = require('./setting');
const __Cookie = require('./util/cookie_util');
const { getWYCookie } = require('./l');
const { getQQCookie } = require('./refreshQQCookie');
const { default: axios } = require('axios');


// 设置qq音乐的cookie
global.qq_cookie = __Cookie.parse(config.qq_cookie);
global.migu_cookie = __Cookie.parse(config.migu_cookie);
global.kugou_cookie = __Cookie.parse(config.kugou_cookie);
global.wy_cookie = __Cookie.parse(config.wy_cookie);

global.cache = new Cache();


setInterval(() => {
    global.cache.clear();
}, 3000);

//更新网易云cookie
// setTimeout(() => {
//     getWYCookie();
// }, 10 * 1000);

setInterval(() => {
    getWYCookie();
}, 1000 * 60 * 60 * 24);

// 更新QQcookie
setTimeout(() => {
    getQQCookie(config.QQ_uin);
}, 10 * 1000);

setInterval(() => {
    getQQCookie(config.QQ_uin);
}, 1000 * 60 * 60);

// 创建一个Koa对象表示web app本身:
const app = new Koa();

app.use(cors());

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    const start = new Date().getTime(); // 当前时间
    try {
        await next(); // 调用下一个middleware
        const ms = new Date().getTime() - start; // 耗费时间
        console.log(`${ctx.request.method} ${ctx.request.url} ${ctx.status} Time: ${ms}ms`); // 打印耗费时间
    } catch (e) {
        const ms = new Date().getTime() - start; // 耗费时间
        console.log(`${ctx.request.method} ${ctx.request.url} ${ctx.status} Time: ${ms}ms`); // 打印耗费时间
        ctx.response.status = 400;
        ctx.response.type = 'application/json';
        ctx.response.body = {
            code: e.code || 'internal:unknown_error',
            message: e.message || ''
        };
    }
});

// 异常捕获
app.use(restify());
app.use(validation());

// add bodyparse middleware
app.use(koaBody({ multipart: true }));
// add router middleware:
app.use(v1.routes());
app.use(index.routes());


// 查询当前版本号
axios.get(`https://github-zc.github.io/wp_MusicApi/version.json`, {
    timeout: 3000
}).then(res => {
    if (res.data.version !== config.version) {
        console.log(`最新版本: ${res.data.version}, 当前版本: ${config.version}, 请及时更新`);
    } else if (res.data.version === config.version) {
        console.log(`最新版本: ${res.data.version}, 当前版本: ${config.version}, 无需更新`);
    }
}).catch(err => {
    console.log('版本检验错误，请检查网络或者联系作者');
}).finally(() => {
    // 在端口3000监听:
    app.listen(config.port, () => {
        console.log('app started at url http://localhost:5000 ...');
    });
})