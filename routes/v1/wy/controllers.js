const Router = require('koa-router');

const { song } = require('./song');
const { getcookie, setcookie } = require('./cookie');

// 新建 wy 路由
const wy = new Router();

// add get method
wy.get('/song', song);
wy.get('/getcookie', getcookie);


// // add post method
wy.post('/setcookie', setcookie);

module.exports = wy;