const Router = require('koa-router');

const { getMasterColor } = require('./getMasterColor');

// 新建 咪咕 路由
const scavengers = new Router();

// add get method

scavengers.get('/getMasterColor', getMasterColor);

module.exports = scavengers;