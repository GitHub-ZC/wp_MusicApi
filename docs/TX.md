# 企鹅音乐<!-- {docsify-ignore} -->

## 搜索

### 搜索

接口：`/v1/qq/search`

说明：调用此接口 , 传入搜索关键词可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户(需要自己传入type参数) , 默认会自动去除 关键词 前后的**空白字符** 

可选参数：

`key`：关键字 默认 暗号

`limit`：每一页返回的数量，默认30

`offset`：页码，默认1

`type`：搜索类型 默认为0 取值意义

0：单曲   1：歌手  2：专辑   3：歌单   4：mv   7：歌词   8：用户



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
- 首页有一个cookie共享仓库，将自己的绿钻 cookie 传入之后， 会自动刷新 cookie ，保持长期有效，仓库使用说明 [cookie 共享仓库地址 点击跳转](https://github-zc.github.io/wp_MusicApi/#/?id=cookie-%e5%85%b1%e4%ba%ab%e4%bb%93%e5%ba%93%e4%bd%bf%e7%94%a8%e8%af%b4%e6%98%8e)
- 服务器 Cookie 的设置，可以使用 [/qq/setcookie/](//#/?id=设置用户cookie)
- 服务器会自动去除mid，br以及songmid之间的**空白字符**

可选参数：

`mid`：歌曲的`songmid`，默认`004O1DHG4MjYOi`

`br`：默认 128 

取值意义： 128：mp3 128k，320：mp3 320k，m4a：m4a格式 128k，flac：flac格式 无损，ape：ape格式 无损

示例：[/v1/qq/song?mid=0039MnYb0qxYhV&br=flac](http://iecoxe.top:5000/v1/qq/song?mid=0039MnYb0qxYhV&br=flac)

`http://localhost:5000/v1/qq/song?mid=001Qu4I30eVFYb,003EKHdv2KvTc6,0032ZOkm0LBgHW`

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





## 获取评论

请求地址：`/v1/qq/comment`

请求示例：`http://iecoxe.top:5000/v1/qq/comment?id=449198&limit=25&type=0`

| 参数    | 是否必须 | 接口说明                                             | 默认值 |
| ------- | -------- | ---------------------------------------------------- | ------ |
| id      | √        | singid, albumid, tid, topid, vid  必填               | 无     |
| offset  | ×        | 偏移量                                               | 1      |
| limit   | ×        | 返回数据量，最大为25                                 | 25     |
| type    | ×        | 0：获取最新评论，1：获取热评                         | 0      |
| biztype | ×        | 获取评论类型 1: 歌曲 2: 专辑 3: 歌单 4: 排行榜 5: mv | 1      |

返回结果说明：

`ispraise` 表示这条评论是否被赞过，1: 是，0: 否；

`enable_delete` 表示这条评论是否能被删除，1: 是，0: 否





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



## 用户登录(新增)

### QQ账号登录

接口：`/v1/qq/login/`

说明：登录接口目前还是只能本地登录，异地登陆官方强制扫描二维码，各位有什么好的办法可以在GitHub中提出

必须参数：

| 参数 | 是否必须 | 接口说明 | 默认 |
| ---- | -------- | -------- | ---- |
| u    | √        | QQ账号   | 无   |
| p    | √        | QQ密码   | 无   |

**注意**：返回  **异地登陆，需要验证码，请在QQ手机关闭登录保护**  代表强制需要扫描二维码

​			**如果登录成功会自动更新本地cookie**

示例：`http://iecoxe.top:3000/v1/qq/login?u=123456&p=123456`



### QQ扫码登录

接口：`/v1/qq/login_scan/`

示例：`http://iecoxe.top:3000/v1/qq/login_scan`

说明：本接口会默认返回二维码，用手机QQ扫码确认即可登录，自动部署Cookie，为防止恶意调用访问接口，默认 **限制访问间隔** 50 秒，重复调用会覆盖服务端Cookie





## Cookie



### 设置服务器Cookie(POST)

接口：`/v1/qq/setcookie/`

说明：具有 QQ 绿钻的用户，通过浏览器查看 Cookie ，通过此接口设置以后，需要登陆的接口可以获取登录才能获取的内容，比如 歌曲播放地址(无损)

必须参数：

`data`：

> 格式：aaa=bbb; ccc=ddd; ....

> 例子：yqq_stat=0; pgv_info=ssid=s1520392; ts_last=y.qq.com/portal/player.html; pgv_pvid=1233495754; ts_uid=5486601780; pgv_pvi=4007713792; pgv_si=s6654436352; userAction=1; _qpsvr_localtk=0.8025676546673662; yq_index=0; yplayer_open=1; player_exist=1; qqmusic_fromtag=66



### 查看当前Cookie

接口：`/v1/qq/getcookie/`

说明：cookie 已经在服务器端，进行的 Json 转化

示例：[/v1/qq/getcookie/](http://iecoxe.top:5000/v1/qq/getcookie/)

