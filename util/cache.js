const moment = require('moment');

class Cache {
    constructor() {
        this.keyMap = {};
        this.timeMap = {};
    }

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

    get(key) {
        // this.clear();
        return this.keyMap[key];
    }

    set(key, value, time = 300) {
        // this.clear();
        const timeKey = moment().add(time, 's').format('YYYYMMDDHHmmss');
        this.keyMap[key] = value;
        this.timeMap[timeKey] = this.timeMap[timeKey] || [];
        this.timeMap[timeKey].push(key);
    }
}

module.exports = Cache;