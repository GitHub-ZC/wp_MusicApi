const Router = require('koa-router');

const migu = require('./migu/controllers');
const qq = require('./qq/controllers');

const v1 = new Router({prefix: '/v1'});


v1.use('/migu', migu.routes());
v1.use('/qq', qq.routes());

module.exports = v1;