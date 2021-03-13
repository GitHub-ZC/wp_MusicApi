# 企鹅音乐<!-- {docsify-ignore} -->

## 搜索

### 搜索

接口：`/v1/qq/search`

说明：调用此接口 , 传入搜索关键词可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户(需要自己传入type参数) , 默认会自动去除 关键词 前后的**空白字符** 

可选参数：

`key`：关键字 默认 暗号

`limit`：每一页返回的数量，默认30

`offset`：页码，默认1

`type`：搜索类型 默认为0 取值意义 type: 0：单曲，2：歌单，3:用户 ,7：歌词，8：专辑，9：歌手，12：mv



`albummid` 为专辑的 mid， 下面为专辑封面图片的路径

> https://y.gtimg.cn/music/photo_new/T002R300x300M000 + `albummid` + _.jpg_

示例：[/v1/qq/search?key=暗号](http://iecoxe.top:5000/v1/qq/search?key=暗号)



### 热搜

接口：`/v1/qq/hotSearch`

可选参数：`from` 默认 `pc`, 可选值 `pc ` 和 `web`

说明：pc可以获取更加详细的热搜内容，web获取的数据比较少

示例：[/v1/qq/hotSearch](http://iecoxe.top:5000/v1/qq/hotSearch)



### 搜索建议

接口：`/v1/qq/suggestSearch`

必选参数：`key`

示例：[/v1/qq/suggestSearch?key=周杰伦](http://iecoxe.top:5000/v1/qq/suggestSearch?key=周杰伦)



## 歌曲url

接口：`/v1/qq/song`

说明：

- 这个接口依赖服务器的 Cookie 信息的，支持批量获取，不一定是全部的歌曲都有无损、高品的， 要注意结合 size320，sizeape，sizeflac 等参数先判断下是否有播放链接
- 服务器内置默认的 Cookie ，如果是未登陆或非 vip 用户的 `cookie`，只能获取到非 vip 用户可听的歌曲
- 服务器 Cookie 的设置，可以使用 [/qq/setcookie/](//#/?id=设置用户cookie)
- 服务器会自动去除mid，br以及songmid之间的**空白字符**

可选参数：

`mid`：歌曲的`songmid`，默认`004O1DHG4MjYOi`

`br`：默认 128 

取值意义： 128：mp3 128k，320：mp3 320k，m4a：m4a格式 128k，flac：flac格式 无损，ape：ape格式 无损

示例：[/v1/qq/song?mid=0039MnYb0qxYhV&br=flac](http://iecoxe.top:5000/v1/qq/song?mid=0039MnYb0qxYhV&br=flac)



## 歌词

接口：`/v1/qq/lyric/`

可选参数：`mid` 默认 `004O1DHG4MjYOi`

示例：[/v1/qq/lyric/?mid=004O1DHG4MjYOi](http://iecoxe.top:5000/v1/qq/lyric/?mid=004O1DHG4MjYOi)



## 获取歌单歌曲列表

请求地址：`/v1/qq/playlist/info`

请求示例：`http://iecoxe.top:5000/v1/qq/playlist/info?pid=2164751441`

| 参数 | 是否必须 | 接口说明 | 默认值 |
| ---- | -------- | -------- | ------ |
| pid  | √        | 歌单 ID  | 无     |





## 排行榜

### 获取榜单列表

接口：`/v1/qq/topCategory`

说明：这个接口数据，包含了榜单名、榜单 id、更新时间、播放量，都是作为下一个接口的请求参数

示例：[/v1/qq/topCategory](http://iecoxe.top:5000/v1/qq/topCategory)



### 获取榜单详情

接口：`/v1/qq/top/`

可选参数：

`topId`: 默认 26，从上面的`/top/category/`中取值

`limit`: 默认 200 // 部分接口不支持这个字段，所以这里默认选择200

`period`: 榜单的时间，从上面的 `/top/category/` 中取值，不填默认返回 **最新** 的排行榜数据

`offset`：每一页返回的歌曲数量，默认 1

返回数据说明

`time`: 当前榜单的发布时间，可能是天，也可能是周

```
timeType`: 当前榜单的时间格式 `YYYY_W` 或 `YYYY-MM-DD
```

`rank`: 在榜单的排名

`rankType`: 1 上升，2 减少，3 持平，4 新歌，6 上升百分比

`rankValue`: 排名改变值

示例：[/v1/qq/top/?topId=26](http://iecoxe.top:5000/v1/qq/top/?topId=26)



## Cookie



### 设置服务器Cookie(POST)

接口：`/v1/qq/setcookie/`

说明：具有 QQ 绿钻的用户，通过浏览器查看 Cookie ，通过此接口设置以后，需要登陆的接口可以获取登录才能获取的内容，比如 歌曲播放地址(无损)

必须参数：

`cookie`：

> 格式：aaa=bbb; ccc=ddd; ....

> 例子：yqq_stat=0; pgv_info=ssid=s1520392; ts_last=y.qq.com/portal/player.html; pgv_pvid=1233495754; ts_uid=5486601780; pgv_pvi=4007713792; pgv_si=s6654436352; userAction=1; _qpsvr_localtk=0.8025676546673662; yq_index=0; yplayer_open=1; player_exist=1; qqmusic_fromtag=66



### 查看当前Cookie

接口：`/v1/qq/getcookie/`

说明：cookie 已经在服务器端，进行的 Json 转化

示例：[/v1/qq/getcookie/](http://iecoxe.top:5000/v1/qq/getcookie/)


