const Router = require('koa-router');

const migu = require('./migu/controllers');
const qq = require('./qq/controllers');
const kuwo = require('./kuwo/controllers');
const kugou = require('./kugou/controllers');
const scavengers = require('./scavengers/controllers');
const wy = require('./wy/controllers');

const v1 = new Router({prefix: '/v1'});


v1.use('/migu', migu.routes());
v1.use('/qq', qq.routes());
v1.use('/kuwo', kuwo.routes());
v1.use('/kugou', kugou.routes());
v1.use('/wy', wy.routes());
v1.use('/scavengers', scavengers.routes());

module.exports = v1;