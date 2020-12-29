const Router = require('koa-router');
const { index } = require('./index');
const { search } = require('./search');
const { song } = require('./song');


const migu = new Router();

// get method
migu.get('/index', index);
migu.get('/search', search);
migu.get('/song', song);

// post method
migu.post('/song', song);

module.exports = migu;