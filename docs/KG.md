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



## 获取音乐歌词（恢复）

请求地址：`/v1/kugou/lyric`

请求示例：`http://iecoxe.top:5000/v1/kugou/lyric?hash=2FF4014692AC079A9B8118966C891897`

| 参数 | 是否必须 | 接口说明 | 默认值                           |
| ---- | -------- | -------- | -------------------------------- |
| hash | √        | 音乐 ID  | 2FF4014692AC079A9B8118966C891897 |



## 搜索

请求地址：`/v1/kugou/search`

请求示例：`http://iecoxe.top:5000/v1/kugou/search?key=周杰伦`

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

| 参数   | 是否必须 | 接口说明   | 默认值 |
| ------ | -------- | ---------- | ------ |
| topId  | √        | 排行榜 ID  | 8888   |
| offset | ×        | 偏移的页数 | 1      |

说明：`默认每一页返回 **30** 首歌曲 **固定**`



## 获取排行榜分类信息

请求地址：`/v1/kugou/topCategory`

请求示例：`http://iecoxe.top:5000/v1/kugou/topCategory`

| 参数 | 是否必须 | 接口说明 | 默认值 |
| ---- | -------- | -------- | ------ |
| 无   |          |          |        |

说明：此次更新后端剔除了一些不可使用的排行榜榜单



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



## 获取歌单歌曲列表

请求地址：`/v1/kugou/playlist/info`

请求示例：`http://iecoxe.top:5000/v1/kugou/playlist/info`

| 参数 | 是否必须 | 接口说明 | 默认值  |
| ---- | -------- | -------- | ------- |
| pid  | √        | 歌单 ID  | 3233449 |

说明：`返回歌单中所有的歌曲信息`