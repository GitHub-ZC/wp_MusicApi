"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hide = exports.lock = exports.int32ip2str = exports.timestamp = exports.sha = exports.md5 = exports.pipeline = exports.gzip = exports.unzip = exports.NOOP = exports.BUF16 = exports.BUF4 = exports.BUF0 = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const zlib = __importStar(require("zlib"));
const stream = __importStar(require("stream"));
/** 一个0长buf */
exports.BUF0 = Buffer.alloc(0);
/** 4个0的buf */
exports.BUF4 = Buffer.alloc(4);
/** 16个0的buf */
exports.BUF16 = Buffer.alloc(16);
/** no operation */
const NOOP = () => { };
exports.NOOP = NOOP;
/** promisified unzip */
exports.unzip = (0, util_1.promisify)(zlib.unzip);
/** promisified gzip */
exports.gzip = (0, util_1.promisify)(zlib.gzip);
/** promisified pipeline */
exports.pipeline = (0, util_1.promisify)(stream.pipeline);
/** md5 hash */
const md5 = (data) => (0, crypto_1.createHash)("md5").update(data).digest();
exports.md5 = md5;
/** sha hash */
const sha = (data) => (0, crypto_1.createHash)("sha1").update(data).digest();
exports.sha = sha;
/** unix timestamp (second) */
const timestamp = () => Math.floor(Date.now() / 1000);
exports.timestamp = timestamp;
/** 数字ip转通用ip */
function int32ip2str(ip) {
    if (typeof ip === "string")
        return ip;
    ip = ip & 0xffffffff;
    return [
        ip & 0xff,
        (ip & 0xff00) >> 8,
        (ip & 0xff0000) >> 16,
        (ip & 0xff000000) >> 24 & 0xff,
    ].join(".");
}
exports.int32ip2str = int32ip2str;
/** 隐藏并锁定一个属性 */
function lock(obj, prop) {
    Reflect.defineProperty(obj, prop, {
        configurable: false,
        enumerable: false,
        writable: false,
    });
}
exports.lock = lock;
/** 隐藏一个属性 */
function hide(obj, prop) {
    Reflect.defineProperty(obj, prop, {
        configurable: false,
        enumerable: false,
        writable: true,
    });
}
exports.hide = hide;
