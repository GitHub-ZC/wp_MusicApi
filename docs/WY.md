# 网易云音乐<!-- {docsify-ignore} -->

## 获取音乐播放地址

请求地址：`/v1/wy/song`

请求示例：`http://iecoxe.top:5000/v1/wy/song?id=167655,353066`

| 参数 | 是否必须 | 接口说明                                | 默认值 |
| ---- | -------- | --------------------------------------- | ------ |
| id   | √        | 音乐 ID，支持批量获取，id之间用逗号隔开 | 无     |

说明：`当前是默认音质，如果想获取VIP音乐，请传入Cookie`





## 获取音乐播放地址

请求地址：`/v1/wy/song`

请求示例：`http://iecoxe.top:5000/v1/wy/songurl?br=lossless&id=1463165983,167655,353066`

| 参数  | 是否必须 | 接口说明                                                     | 默认值 |
| ----- | -------- | ------------------------------------------------------------ | ------ |
| id    | √        | 音乐 ID，支持批量获取，id之间用逗号隔开                      | 无     |
| level | ×        | 播放音质等级, 分为 `standard` => `标准`,`higher` => `较高`, `exhigh`=>`极高`, `lossless`=>`无损`, `hires`=>`Hi-Res` | higher |

说明：`当前是默认音质，如果想获取VIP音乐，请传入Cookie`



## 获取歌单歌曲列表

请求地址：`/v1/wy/playlist/info`

请求示例：`http://iecoxe.top:5000/v1/wy/playlist/info?pid=12423324`

| 参数 | 是否必须 | 接口说明 | 默认值 |
| ---- | -------- | -------- | ------ |
| pid  | √        | 歌单 ID  | 无     |





## Cookie



### 设置服务器Cookie(POST)

接口：`/v1/wy/setcookie/`

说明：具有 酷狗会员的用户，通过浏览器查看 Cookie ，通过此接口设置以后，需要登陆的接口可以获取登录才能获取的内容，比如 歌曲播放地址(无损)

必须参数：

`data`：

> 格式：aaa=bbb; ccc=ddd; ....

> 例子：yqq_stat=0; pgv_info=ssid=s1520392; ts_last=y.qq.com/portal/player.html; pgv_pvid=1233495754; ts_uid=5486601780; pgv_pvi=4007713792; pgv_si=s6654436352; userAction=1; _qpsvr_localtk=0.8025676546673662; yq_index=0; yplayer_open=1; player_exist=1; qqmusic_fromtag=66



### 查看当前Cookie

接口：`/v1/wy/getcookie/`

说明：cookie 已经在服务器端，进行的 Json 转化

示例：[/v1/wy/getcookie/](http://iecoxe.top:5000/v1/wy/getcookie/)

