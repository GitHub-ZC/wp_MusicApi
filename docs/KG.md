# 酷狗音乐<!-- {docsify-ignore} -->

## 获取音乐播放地址(图片，歌名，作者)

请求地址：`/v1/kugou/song`

请求示例：`http://iecoxe.top:5000/v1/kugou/song?aid=156483846`

| 参数 | 是否必须 | 接口说明   | 默认值                           |
| ---- | -------- | ---------- | -------------------------------- |
| aid  | √        | album_id   | 966846                           |
| hash | √        | hash_value | 03571660BC0BD02FAA5994E19F97A005 |

说明：`如果只传入 **hash_value** ，可以只获取(图片，歌名，作者)`

​			`两个参数都正确传入，能够获取歌词和播放地址`

​			`如果想要获取会员歌曲，请自行传入COOKIE`





## 获取音乐播放地址

请求地址：`/v1/kugou/getsong`

请求示例：`http://iecoxe.top:5000/v1/kugou/getsong?aid=156483846`

| 参数 | 是否必须 | 接口说明   | 默认值                           |
| ---- | -------- | ---------- | -------------------------------- |
| aid  | √        | album_id   | 966846                           |
| hash | √        | hash_value | 03571660BC0BD02FAA5994E19F97A005 |

说明：不带cookie信息的接口，只能获取普通歌曲



## 获取音乐歌词（恢复）

请求地址：`/v1/kugou/lyric`

请求示例：`http://iecoxe.top:5000/v1/kugou/lyric?hash=2FF4014692AC079A9B8118966C891897`

| 参数 | 是否必须 | 接口说明 | 默认值                           |
| ---- | -------- | -------- | -------------------------------- |
| hash | √        | 音乐 ID  | 2FF4014692AC079A9B8118966C891897 |



## 搜索(建议)

请求地址：`/v1/kugou/search`

请求示例：`http://iecoxe.top:5000/v1/kugou/search?key=周杰伦`

| 参数   | 是否必须 | 接口说明       | 默认值   |
| ------ | -------- | -------------- | -------- |
| key    | √        | 关键字         | 默认为空 |
| limit  | ×        | 搜索结果的数量 | 30       |
| offset | ×        | 数据的偏移量   | 1        |

说明：`offset相当于页数，1，2，3，…  不需要 乘以 limit`



## 搜索

请求地址：`/v1/kugou/mobileSearch`

请求示例：`http://iecoxe.top:5000/v1/kugou/mobileSearch?key=周杰伦`

| 参数   | 是否必须 | 接口说明       | 默认值   |
| ------ | -------- | -------------- | -------- |
| key    | √        | 关键字         | 默认为空 |
| limit  | ×        | 搜索结果的数量 | 30       |
| offset | ×        | 数据的偏移量   | 1        |

说明：`offset相当于页数，1，2，3，…  不需要 乘以 limit`



## 热门搜索

请求地址：`/v1/kugou/hotSearch`

请求示例：`http://iecoxe.top:5000/v1/kugou/hotSearch`

| 参数 | 是否必须 | 接口说明            | 默认值 |
| ---- | -------- | ------------------- | ------ |
| from | ×        | from填`pc` 或 `web` | `pc`   |

说明：`pc`返回的数据比较详细



## 搜索建议

请求地址：`/v1/kugou/suggestSearch`

请求示例：`http://iecoxe.top:5000/v1/kugou/suggestSearch?key=周`

| 参数 | 是否必须 | 接口说明 | 默认值   |
| ---- | -------- | -------- | -------- |
| key  | √        | 关键字   | 默认为空 |



## 获取排行榜

请求地址：`/v1/kugou/top`

请求示例：`http://iecoxe.top:5000/v1/kugou/top?topId=8888`

| 参数     | 是否必须 | 接口说明   | 默认值 |
| -------- | -------- | ---------- | ------ |
| topId    | √        | 排行榜 ID  | 8888   |
| offset   | ×        | 偏移的页数 | 1      |
| platform | ×        | 平台选择   | web    |

说明：`默认每一页返回 **30** 首歌曲 **固定**`

​			` platform 选择 pc  可以获取客户端酷狗排行榜数据， 建议大家使用这个`

## 获取排行榜分类信息

请求地址：`/v1/kugou/topCategory`

请求示例：`http://iecoxe.top:5000/v1/kugou/topCategory`

| 参数 | 是否必须 | 接口说明 | 默认值 |
| ---- | -------- | -------- | ------ |
| 无   |          |          |        |

说明：此次更新后端剔除了一些不可使用的排行榜榜单





## 获取评论

请求地址：`/v1/kugou/comment`

请求示例：`http://iecoxe.top:5000/v1/kugou/comment?hash=515002B2A4F27CC4C0911CE898335A17&limit=20&offset=1&type=0`

| 参数   | 是否必须 | 接口说明                     | 默认值 |
| ------ | -------- | ---------------------------- | ------ |
| hash   | √        | 歌曲hash值                   | 无     |
| offset | ×        | 偏移量                       | 1      |
| limit  | ×        | 返回数据量，最大为40         | 30     |
| type   | ×        | 0：获取最新评论，1：获取热评 | 0      |

返回结果说明：

`reply_num` 表示这条评论的回复数量；

`user_pic` 表示这条评论的用户头像；

`images` 表示评论中发布的图片，有的评论中会有图片+文字；





## 获取回复评论

请求地址：`/v1/kugou/replyComment`

请求示例：`http://iecoxe.top:5000/v1/kugou/replyComment?special_child_id=20505418&id=500228896`

| 参数             | 是否必须 | 接口说明                   | 默认值 |
| ---------------- | -------- | -------------------------- | ------ |
| special_child_id | √        | 主评论中的special_child_id | 无     |
| offset           | ×        | 偏移量                     | 1      |
| limit            | ×        | 返回数据量，最大为50       | 30     |
| id               | √        | 主评论中的id               | 无     |







## 获取歌单标签下的歌单信息

请求地址：`/v1/kugou/playlist/tag`

请求示例：`http://iecoxe.top:5000/v1/kugou/playlist/tag`

| 参数   | 是否必须 | 接口说明     | 默认值 |
| ------ | -------- | ------------ | ------ |
| tagid  | √        | 歌单标签 ID  |        |
| sortId | ×        | 返回歌曲数量 | 5      |
| offset | ×        | 数据偏移页数 | 1      |

说明：`每一页返回 **20** 数据(歌单数量)`

```json
// sortId参数相关说明
{
    name: '推荐',
    sortId: '5',
},
{
    name: '最热',
    sortId: '6',
},
{
    name: '最新',
    sortId: '7',
},
{
    name: '热藏',
    sortId: '3',
},
{
    name: '飙升',
    sortId: '8',
}
```



## 获取歌单标签分类

请求地址：`/v1/kugou/playlist/tagCategory`

请求示例：`http://iecoxe.top:5000/v1/kugou/playlist/tagCategory`

| 参数 | 是否必须 | 接口说明 | 默认值 |
| ---- | -------- | -------- | ------ |
| 无   |          |          |        |



## (新增)获取歌单广场

请求地址：`/v1/kugou/playlist/list`

请求示例：`http://iecoxe.top:5000/v1/kugou/playlist/list`

| 参数   | 是否必须 | 接口说明       | 默认值 |
| ------ | -------- | -------------- | ------ |
| offset | ×        | 返回的偏移页数 | 1      |

说明：`返回歌单广场，可以用来编写客户端的歌单广场`





## 获取歌单歌曲列表

请求地址：`/v1/kugou/playlist/info`

请求示例：`http://iecoxe.top:5000/v1/kugou/playlist/info`

| 参数 | 是否必须 | 接口说明 | 默认值  |
| ---- | -------- | -------- | ------- |
| pid  | √        | 歌单 ID  | 3233449 |

说明：`返回歌单中所有的歌曲信息`





## 导入自建歌单歌曲(新增)

请求地址：`/v1/kugou/playlist/import`

请求示例：`http://iecoxe.top:5000/v1/kugou/playlist/import?id=4129905`

| 参数 | 是否必须 | 接口说明 | 默认值 |
| ---- | -------- | -------- | ------ |
| id   | √        | 酷狗码   |        |

说明：`通过 酷狗码 导入自建歌单 我喜欢 等等， 目前只能导入最大歌曲数目 500 首`







## Cookie



### 设置服务器Cookie(POST)

接口：`/v1/kugou/setcookie/`

说明：具有 酷狗会员的用户，通过浏览器查看 Cookie ，通过此接口设置以后，需要登陆的接口可以获取登录才能获取的内容，比如 歌曲播放地址(无损)

必须参数：

`data`：

> 格式：aaa=bbb; ccc=ddd; ....

> 例子：yqq_stat=0; pgv_info=ssid=s1520392; ts_last=y.qq.com/portal/player.html; pgv_pvid=1233495754; ts_uid=5486601780; pgv_pvi=4007713792; pgv_si=s6654436352; userAction=1; _qpsvr_localtk=0.8025676546673662; yq_index=0; yplayer_open=1; player_exist=1; qqmusic_fromtag=66



### 查看当前Cookie

接口：`/v1/kugou/getcookie/`

说明：cookie 已经在服务器端，进行的 Json 转化

示例：[/v1/kugou/getcookie/](http://iecoxe.top:5000/v1/kugou/getcookie/)

