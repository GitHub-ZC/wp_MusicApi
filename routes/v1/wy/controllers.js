const Router = require('koa-router');

const { song, songUrl } = require('./song');
const { getcookie, setcookie } = require('./cookie');
const { playlist_Info } = require('./playlist');
const { search } = require('./search');
const { lyric } = require('./lyric');
const { mv_url } = require('./mv');


// 新建 wy 路由
const wy = new Router();

// add get method
wy.get('/song', song);
wy.get('/songUrl', songUrl);
wy.get('/getcookie', getcookie);

wy.get('/playlist/info', playlist_Info);

wy.get('/search', search);

wy.get('/lyric', lyric);
wy.get('/mv_url', mv_url);


// // add post method
wy.post('/setcookie', setcookie);

module.exports = wy;