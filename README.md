> wp_MusicApi 一个荒野拾荒者的 API 



![](https://img.shields.io/badge/最新版本-v1.5.2-green)

[![](https://img.shields.io/badge/QQ群1-922193759-green)](https://jq.qq.com/?_wv=1027&k=3USa76OC)



[点击加入QQ群](https://jq.qq.com/?_wv=1027&k=3USa76OC)

## 公告

文档地址：[文档](https://github-zc.github.io/wp_MusicApi/)

网易云接口：[点击跳转](https://binaryify.github.io/NeteaseCloudMusicApi/)		（服务器地址：http://iecoxe.top:3000 ）

个人博客CSDN：[CSDN地址](https://blog.csdn.net/weixin_44358443?type=blog)

基于本接口开发的软件：

[wp music Android版](https://blog.iecoxe.top/2021/03/07/7/)

[wp music 电脑版](https://github.com/GitHub-ZC/Wp_music/releases)



欢迎大家关注**微信公众号**，后续会慢慢更新优质资源

![请关注一下公众号，每天有精彩资源推送](C:\Users\15314\Desktop\tools\wp_MusicApi\docs\请关注一下公众号，每天有精彩资源推送.jpg)

## 新版特性

1. 相对更加稳定,服务器不再过滤参数内容,用户自行解析参数,减少参数解析出错几率
2. 支持平台：QQ 音乐,酷狗音乐,酷我音乐,咪咕音乐，网易，具体音乐音质支持往下看
3. 接口更加丰富,增加部分接口和平台
4. 降低门槛,参数简单统一,支持 GET 请求,支持跨域调用





## 项目安装与使用(新增 npm 安装方式)

[wp_MusicApi 安装使用说明](https://github-zc.github.io/wp_MusicApi/#/common)





## Cookie 共享仓库使用说明

最近新写的接口，单独部署，主要实现 QQ音乐 Cookie 自动刷新



> 接口：(GET)  http://42.192.118.65:5100/qq/getCookie

示例：http://42.192.118.65:5100/qq/getCookie?uin=123456789

参数：uin => QQ号

注意：获取前提是 你上传过(通过/qq/setCookie接口) 登录成功的 QQ音乐 Cookie 字符串



> 接口：(POST)  http://42.192.118.65:5100/qq/setCookie

参数：data => QQ音乐 Cookie 字符串格式

功能：上传的Cookie会自动刷新登录，通过(/qq/getCookie)获取的是刷新过后的Cookie

注意：请上传登录成功的 QQ音乐 Cookie 字符串格式（浏览器 F12 获取），请使用 `x-www-form-urlencoded` 格式提交



**项目介绍**：此项目只需要在 `setting.js` 项目设置文件中，修改 `QQ_uin` 字段的值(请填入QQ号，如果需要获取VIP歌曲，请传入带绿钻的QQ号，**前提是先将登陆过的Cookie传入共享仓库**)，就能实现Cookie的自动刷新





## 工作原理

跨站请求伪造 (CSRF), 伪造请求头 , 调用官方 API



## 关于项目

> wp_MusicApi 拾荒者的音乐接口

v1.0：项目开始

v1.1：新建`cache_redis`分支，主要用于服务端缓存，默认两分钟，需要的请自行clone

v1.2：新增的咪咕、酷我、QQ的热搜参数，新增`pc`和`web`，更正了文档的已知错误，修改了咪咕和酷我的排行榜数据内容格式，以前使用本API的请**注意**

v1.3:  维护所有失效接口，新增网易播放接口以及Cookie上传，新增咪咕高无损，新增酷狗无损以及Cookie上传，新增QQ登录，新增缓存，默认缓存5分钟，更新文档，修改了咪咕排行榜的数据格式，修改了QQ搜索的数据格式， 具体请自行研究。

v1.3.1: 新增 首页导航，提示项目正在运行，新增版本检测提示

v1.3.2: 更新酷狗搜索，改走客户端接口，更改版本检测timeout时间为3秒

v1.3.3: 新增酷狗 mobileSearch 接口

v1.3.4: 更新 酷狗排行榜详情 接口

v1.3.5:  维护部分接口

v1.4:  新增QQ扫码登录，本次采用的是基于Android端QQ音乐的身份令牌，登陆时间会保证更长时间

v1.4.1:  去除QQ基于Android端QQ音乐的扫码登录，新增接口加密，默认关闭，需要打开可以在 setting.js 中打开，新增网易云歌单歌曲获取，新增网易云无损音乐

v1.4.2:  新增网易云搜索接口

v1.4.3:  新增网易云歌词接口，网易云mv播放地址获取接口

v1.4.4:  新增网易云排行榜详情接口

v1.4.5:  新增网易云每日推荐歌曲接口，新增QQ登录自动刷新功能 => 在 `setting.js` 设置文件中 修改 **QQ_uin** 字段 ，QQ Cookie会自动刷新(需要在Cookie共享仓库中上传自己的Cookie信息)

v1.5.0:  新增五个平台的评论接口，从此版本开始，项目支持 **npm** 安装方式([npm 使用说明](https://github-zc.github.io/wp_MusicApi/#/common))

v1.5.1:  新增一个新的网易获取接口，并且可以自定义传入 cookie

v1.5.2:  新增酷狗歌单导入(酷狗码)，新增酷我歌单导入，新增qq获取播放链接(批量获取)







## 用户须知

!> 考虑到性能问题，可以使用专门服务器与本项目对接，例如`nginx`，具体的搭建方法还请用户自行百度，这里不做演示

!> 该项目仅做接口转发，部分接口通过修改 `Referer` 实现，所有数据均不做存储处理，部分接口采用缓存，大家还是理性的保护好自己的个人信息，谨防诈骗

!> 目前本项目刚刚开始，只提供QQ、咪咕、酷我、酷狗等音乐平台部分接口，后期再不断完善

!> 本项目仅供学习使用,请尊重版权，请勿利用此项目从事商业行为



## 友情链接

[拾荒者](https://blog.iecoxe.top)



## 捐赠

> 关于捐赠，强求大家耐心看完

免费的东西不长久，毕竟家里没矿，生活在三次元的我总要考虑一下恰饭问题，所以有了这个赞助。你的赞助不仅会被用来支付一些开发成本：服务器、域名、付费软件等，还将帮助我奉献更多的时间到项目中。如果你正在使用我的 API，可以用赞助来表示你的谢意，并让项目保持健康稳定和得到更积极的维护

我不会忘记支持我的人，也不会把你的支持当作理所当然，它对我意义重大。

周期性赞助请联系我，你将会得到我的帮助；如果你不喜欢周期性赞助，也可以选择一次性赞助方式：

![支付宝、微信](./docs/1660899340003.jpg)



## 捐赠列表

> 以下排名不分先后

特别感谢 **超 女士

感谢 **宇 先生



## 免责申明

1. 以上开发接口仅限于技术研究和项目开发练习使用，禁止商业用途，如有发现直接关闭服务
2. 音乐版权归各音乐平台所有，若有侵犯版权，请联系我删除

