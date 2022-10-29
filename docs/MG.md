# 咪咕音乐<!-- {docsify-ignore} -->

## 搜索

### 搜索

接口：`/v1/migu/search`

可选参数：

`key`：关键字 默认 暗号

`limit`：每一页返回的数量，默认30

`offset`：页码，默认 1

`type`：默认 2 ；     //  歌曲： 2   歌手：1  专辑： 4 歌单：6  MV：5  歌词：7

说明：调用此接口 , 传入搜索关键词可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户(需要自己传入type参数) , 默认会自动去除 关键词 前后的**空白字符** 

示例：[/v1/migu/search?key=晴天](http://iecoxe.top:5000/v1/migu/search?key=晴天)



### 热搜

接口：`/v1/migu/hotSearch`

说明：调用此接口，默认会进行缓存处理

示例：[/v1/migu/hotSearch](http://iecoxe.top:5000/v1/migu/hotSearch)



### 搜索建议

接口：`/v1/migu/suggestSearch?key=周杰伦`

必选参数：`key`

示例：[/v1/migu/suggestSearch?key=周杰伦](http://iecoxe.top:5000/v1/migu/suggestSearch?key=周杰伦)



## 歌曲url

接口：`/v1/migu/song`

说明：

- 由于目前时间紧促，目前此接口只能获取**128k**歌曲
- migu没有采取 Cookie ，本人没有账号
- 服务器会自动去除 id 以及之间的**空白字符**

可选参数：

`cid`：歌曲的`copyrightId`，默认`60054701923`
`br`：1: 普通 2: 高品质 3: 无损  4: 高无损，默认`1`

示例：[/v1/migu/song?cid=60054701923](http://iecoxe.top:5000/v1/migu/song?cid=60054701923&br=3)



## 歌词

接口：`/v1/migu/lyric`

可选参数：`cid`  歌曲的copyrightId      默认 `60084600554`

示例：[/v1/migu/lyric?cid=60084600554](http://iecoxe.top:5000/v1/migu/lyric?cid=60084600554)







## 获取评论

请求地址：`/v1/migu/comment`

请求示例：`http://iecoxe.top:5000/v1/migu/comment?id=2643&type=1&limit=30`

| 参数   | 是否必须 | 接口说明                     | 默认值 |
| ------ | -------- | ---------------------------- | ------ |
| hash   | √        | 歌曲hash值                   | 无     |
| offset | ×        | 偏移量                       | 1      |
| limit  | ×        | 返回数据量，最大为50         | 30     |
| type   | ×        | 0：获取最新评论，1：获取热评 | 0      |





## 获取回复评论

请求地址：`/v1/kugou/replyComment`

请求示例：`http://iecoxe.top:5000/v1/migu/replyComment?commentId=1000000000000007203662`

| 参数      | 是否必须 | 接口说明             | 默认值 |
| --------- | -------- | -------------------- | ------ |
| commentId | √        | 主评论中的commentId  | 无     |
| offset    | ×        | 偏移量               | 1      |
| limit     | ×        | 返回数据量，最大为50 | 30     |









## 排行榜

### 获取榜单列表

接口：`/v1/migu/topCategory`

说明：由于自我认为官方的 ajax 接口返回的数据太少，以及接口不健全，于是自己通过爬虫爬取获取的排行榜数据

说明：最新版本接口已经更新此接口数据，为了兼容移动端(2021-2-21更新)

示例：[/v1/migu/topCategory](http://iecoxe.top:5000/v1/migu/topCategory)



### 获取榜单详情

接口：`/v1/migu/top`

说明：由于自我认为官方的 ajax 接口返回的数据太少，以及接口不健全，于是自己通过爬虫爬取获取的排行榜数据

可选参数：`topId`  默认27553319，新歌榜

说明：`topId`参数通过`/v1/migu/topCategory`接口获取

示例：[/v1/migu/top?topId=27553319](http://iecoxe.top:5000/v1/migu/top?topId=27553319)



## 歌手

### 歌手详情

接口：`/v1/migu/singer/info`

可选参数：

`artistId`：歌手ID  ，默认 18196

示例：[/v1/migu/singer/info?artistId=18196](http://iecoxe.top:5000/v1/migu/singer/info?artistId=18196)



### 歌手歌曲列表

接口：`/v1/migu/singer/songList/`

说明：由于自我认为官方的 ajax 接口返回的数据太少，以及接口不健全，于是自己通过爬虫爬取获取的歌手歌曲列表数据

可选参数：

`artistId`：歌手ID，默认 18196

`offset`：分页，默认 1

示例：[/v1/migu/singer/songList/?artistId=18196&offset=1](http://iecoxe.top:5000/v1/migu/singer/songList/?artistId=18196&offset=1)



## 歌单

### <s>歌单</s>(无效接口)

接口：`/v1/migu/playlist/`

说明：由于官方接口原因，默认每一页返回 10 条数据

可选参数：

`offset`：分页， 默认 1

`type`：1： 推荐 ； 2： 最新， 默认 推荐

示例：[/v1/migu/playlist/](http://iecoxe.top:5000/v1/migu/playlist/)

返回字段含义：`contentCount` 歌单 歌曲 的总数量，可用于 下面接口 中  `limit` 参数



### 歌单详情

接口：`/v1/migu/playlist/info/`

说明：`playListId`、`limit` 根据上面的接口( `/v1/migu/playlist/` )返回数据中获取

​			`limit` 对应上面接口中的 `contentCount`

可选参数：

`playListId`：歌单的 ID，默认 179730639

`limit`：返回数据的数量，默认 30

示例：[/v1/migu/playlist/info/](http://iecoxe.top:5000/v1/migu/playlist/info/)



## Cookie



### 设置服务器Cookie(POST)

接口：`/v1/migu/setcookie/`

说明：<s>咪咕突然需要登陆了，通过浏览器查看 Cookie ，通过此接口设置以后，需要登陆的接口可以获取登录才能获取的内容，比如 歌曲播放地址(无损)</s>   **暂时不需要**

必须参数：

`data`：

> 格式：aaa=bbb; ccc=ddd; ....

> 例子：yqq_stat=0; pgv_info=ssid=s1520392; ts_last=y.qq.com/portal/player.html; pgv_pvid=1233495754; ts_uid=5486601780; pgv_pvi=4007713792; pgv_si=s6654436352; userAction=1; _qpsvr_localtk=0.8025676546673662; yq_index=0; yplayer_open=1; player_exist=1; qqmusic_fromtag=66



### 查看当前Cookie

接口：`/v1/migu/getcookie/`

说明：cookie 已经在服务器端，进行的 Json 转化

示例：[/v1/migu/getcookie/](http://iecoxe.top:5000/v1/migu/getcookie/)

