// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
// 注意require('koa-router')返回的是函数:
const v1 = require('./routes/v1/controllers');
// 解析request的body的功能
const koaBody = require("koa-body");

// 创建一个Koa对象表示web app本身:
const app = new Koa();

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    // try {
        const start = new Date().getTime(); // 当前时间
        await next(); // 调用下一个middleware
        const ms = new Date().getTime() - start; // 耗费时间
        console.log(`${ctx.request.method} ${ctx.request.url} ${ctx.status} Time: ${ms}ms`); // 打印耗费时间
    // } catch (error) {
    //     ctx.body = JSON.stringify({
    //         error: '服务端内部错误，请联系管理员',
    //         status: 400,
    //         info: error.toString()
    //     })
    //     ctx.type = 'application/json';
    // }
});


// add bodyparse middleware
app.use(koaBody({ multipart: true }));
// add router middleware:
app.use(v1.routes());

// 在端口3000监听:
app.listen(5000);
console.log('app started at url http://localhost:5000 ...');