const Router = require('koa-router');

const { search, hotSearch, suggestSearch } = require('./search');
const { song } = require('./song');
const { lyric } = require('./lyric');
const { top, topCategory } = require('./top');
const { singer_Info, singer_songList } = require('./singer');
const { playList_info } = require('./playlist');
const { getcookie, setcookie } = require('./cookie');
const { comment, replyComment } = require('./comment');


// 新建 咪咕 路由
const migu = new Router();

// add get method

migu.get('/search', search);
migu.get('/hotSearch', hotSearch);
migu.get('/suggestSearch', suggestSearch);

migu.get('/song', song);

migu.get('/lyric', lyric);

migu.get('/top', top);
migu.get('/topCategory', topCategory);

migu.get('/singer/info', singer_Info);
migu.get('/singer/songList', singer_songList);

migu.get('/comment', comment);
migu.get('/replyComment', replyComment);

migu.get('/playlist/info', playList_info);

migu.get('/getcookie', getcookie);

// add post method
migu.post('/song', song);
// // add post method
migu.post('/setcookie', setcookie);

module.exports = migu;