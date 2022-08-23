const Router = require('koa-router');

const { search, hotSearch, suggestSearch } = require('./search');
const { song, songInfo } = require('./song');
const { top, topCategory } = require('./top');
const { lyric } = require('./lyric');
const { playlist_tagCategory, playlist_Tag, playlist_Info } = require('./playlist');

// 新建 酷我 路由
const kuwo = new Router();

// add get method

kuwo.get('/search', search);
kuwo.get('/hotSearch', hotSearch);
kuwo.get('/suggestSearch', suggestSearch);

kuwo.get('/song', song);
kuwo.get('/songInfo', songInfo);

kuwo.get('/lyric', lyric);

kuwo.get('/top', top);
kuwo.get('/topCategory', topCategory);

// kuwo.get('/singer/info', singer_Info);
// kuwo.get('/singer/songList', singer_songList);

kuwo.get('/playlist/tagCategory', playlist_tagCategory);
kuwo.get('/playlist/tag', playlist_Tag);
kuwo.get('/playlist/info', playlist_Info);

// // add post method
// kuwo.post('/song', song);

module.exports = kuwo;