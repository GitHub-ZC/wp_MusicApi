# 拾荒者API<!-- {docsify-ignore} -->

## 获取图片主要颜色

请求地址：`/v1/scavengers/getMasterColor`

请求示例：`iecoxe.top:5000/v1/scavengers/getMasterColor?imgUrl=http:/`

| 参数   | 是否必须 | 接口说明               | 默认值 |
| ------ | -------- | :--------------------- | ------ |
| imgUrl | √        | imgUrl为图片的网络地址 | 无     |

说明：如何图片颜色获取错误(大概率由于网络原因)，错误返回`#FFFFFF`纯白色