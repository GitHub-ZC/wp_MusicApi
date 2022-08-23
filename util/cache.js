const moment = require('moment');


/**
 * 自行编写的一个数据缓存服务，是通过计时器来实现 主要通过 定时器 定时清除 过期数据， 具体定时器代码再 app.js
 */
class Cache {
    constructor() {
        this.keyMap = {};
        this.timeMap = {};
    }

    /* 无效数据的清理 */
    clear() {
        const nowKey = moment().format('YYYYMMDDHHmmss');
        // if(this.lastClear === nowKey) {
        //     return;
        // }

        const clearTimeArr = Object.keys(this.timeMap).filter((v) => v <= nowKey);
        clearTimeArr.forEach((timeKey) => {
            this.timeMap[timeKey].forEach((key) => {
                delete this.keyMap[key];
            })
            delete this.timeMap[timeKey];
        })
        // this.lastClear = nowKey;
    }

    /* 通过对应 key 获取缓存内容 */
    get(key) {
        // this.clear();
        return this.keyMap[key];
    }

    /* 设置 缓存内容 */
    set(key, value, time = 300) {
        // this.clear();
        const timeKey = moment().add(time, 's').format('YYYYMMDDHHmmss');
        this.keyMap[key] = value;
        this.timeMap[timeKey] = this.timeMap[timeKey] || [];
        this.timeMap[timeKey].push(key);
    }
}

/* 导出对应包 */
module.exports = Cache;