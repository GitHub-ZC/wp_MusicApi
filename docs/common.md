# 使用说明<!-- {docsify-ignore} -->

## 安装

```shell
$ git clone https://github.com/GitHub-ZC/wp_MusicApi.git
$ cd wp_MusicApi/
$ npm install
```



## 运行

```shell
$ npm start
```

> 默认端口 5000 需要更改启动端口的可以在 __setting.js__ 文件中设置



## npm 

```javascript
// 如果需要在项目中引入 wp_MusicApi, 示例如下
npm i wp_musicapi
```



## 接口调用

```javascript

// 引入 wp_MusicApi
const wp_musicapi = require("wp_musicapi");

// 咪咕搜索
wp_musicapi["/v1/migu/song"]({br: 1}).then(res => console.log(res));
// QQ搜索
wp_musicapi["/v1/qq/search"]({key: '周杰伦'}).then(res => console.log(res));

// 酷我搜索
(async () => {
    let res = await wp_musicapi["/v1/kuwo/search"]({
        from: 'pc',
        key: '许嵩'
    });

    console.log(res);
})();

```

