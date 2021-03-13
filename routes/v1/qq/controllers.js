const Router = require('koa-router');

const { search, hotSearch, suggestSearch } = require('./search');
const { song } = require('./song');
const { top, topCategory } = require('./top');
const { lyric } = require('./lyric');
const { getcookie, setcookie } = require('./cookie');
const { playlist_Info } = require('./playlist'); /* playlist_tagCategory, playlist_Tag, */

// 新建 咪咕 路由
const qq = new Router();

// add get method

qq.get('/search', search);
qq.get('/hotSearch', hotSearch);
qq.get('/suggestSearch', suggestSearch);

qq.get('/song', song);
// qq.get('/songInfo', songInfo);

qq.get('/lyric', lyric);

qq.get('/top', top);
qq.get('/topCategory', topCategory);

qq.get('/getcookie', getcookie);

// qq.get('/singer/info', singer_Info);
// qq.get('/singer/songList', singer_songList);

// qq.get('/playlist/tagCategory', playlist_tagCategory);
// qq.get('/playlist/tag', playlist_Tag);
qq.get('/playlist/info', playlist_Info);

// // add post method
qq.post('/setcookie', setcookie);

module.exports = qq;