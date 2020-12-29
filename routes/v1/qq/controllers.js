const Router = require('koa-router');
const { index } = require('./index');
// const { search } = require('./search');


const qq = new Router();


qq.get('/index', index);
// qq.get('/search', search);


module.exports = qq;