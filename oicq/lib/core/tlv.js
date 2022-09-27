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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPacker = void 0;
const crypto = __importStar(require("crypto"));
const tea = __importStar(require("./tea"));
const pb = __importStar(require("./protobuf"));
const writer_1 = __importDefault(require("./writer"));
const constants_1 = require("./constants");
const device_1 = require("./device");
function packTlv(tag, ...args) {
    const t = map[tag].apply(this, args);
    const lbuf = Buffer.allocUnsafe(2);
    lbuf.writeUInt16BE(t.readableLength);
    t.unshift(lbuf);
    const tbuf = Buffer.allocUnsafe(2);
    tbuf.writeUInt16BE(tag);
    t.unshift(tbuf);
    return t.read();
}
const map = {
    0x01: function () {
        return new writer_1.default()
            .writeU16(1) // ip ver
            .writeBytes(crypto.randomBytes(4))
            .writeU32(this.uin)
            .write32(Date.now() & 0xffffffff)
            .writeBytes(Buffer.alloc(4)) //ip
            .writeU16(0);
    },
    0x08: function () {
        return new writer_1.default()
            .writeU16(0)
            .writeU32(2052)
            .writeU16(0);
    },
    0x16: function () {
        const apk = (0, device_1.getApkInfo)(device_1.Platform.Watch);
        return new writer_1.default()
            .writeU32(7)
            .writeU32(apk.appid)
            .writeU32(apk.subid)
            .writeBytes(this.device.guid)
            .writeTlv(apk.id)
            .writeTlv(apk.ver)
            .writeTlv(apk.sign);
    },
    0x18: function () {
        return new writer_1.default()
            .writeU16(1) // ping ver
            .writeU32(1536)
            .writeU32(this.apk.appid)
            .writeU32(0) // app client ver
            .writeU32(this.uin)
            .writeU16(0)
            .writeU16(0);
    },
    0x1B: function () {
        return new writer_1.default()
            .writeU32(0)
            .writeU32(0)
            .writeU32(3)
            .writeU32(4)
            .writeU32(72)
            .writeU32(2)
            .writeU32(2)
            .writeU16(0);
    },
    0x1D: function () {
        return new writer_1.default()
            .writeU8(1)
            .writeU32(184024956)
            .writeU32(0)
            .writeU8(0)
            .writeU32(0);
    },
    0x1F: function () {
        return new writer_1.default()
            .writeU8(0)
            .writeTlv("android")
            .writeTlv("7.1.2")
            .writeU16(2)
            .writeTlv("China Mobile GSM")
            .writeTlv(constants_1.BUF0)
            .writeTlv("wifi");
    },
    0x33: function () {
        return new writer_1.default().writeBytes(this.device.guid);
    },
    0x35: function () {
        return new writer_1.default().writeU32(8);
    },
    0x100: function (emp = 0) {
        return new writer_1.default()
            .writeU16(1) // db buf ver
            .writeU32(7) // sso ver, dont over 7
            .writeU32(this.apk.appid)
            .writeU32(emp ? 2 : this.apk.subid)
            .writeU32(0) // app client ver
            .writeU32(this.apk.sigmap);
    },
    0x104: function () {
        return new writer_1.default().writeBytes(this.sig.t104);
    },
    0x106: function (md5pass) {
        const body = new writer_1.default()
            .writeU16(4) // tgtgt ver
            .writeBytes(crypto.randomBytes(4))
            .writeU32(7) // sso ver
            .writeU32(this.apk.appid)
            .writeU32(0) // app client ver
            .writeU64(this.uin)
            .write32(Date.now() & 0xffffffff)
            .writeBytes(Buffer.alloc(4)) // dummy ip
            .writeU8(1) // save password
            .writeBytes(md5pass)
            .writeBytes(this.sig.tgtgt)
            .writeU32(0)
            .writeU8(1) // guid available
            .writeBytes(this.device.guid)
            .writeU32(this.apk.subid)
            .writeU32(1) // login type password
            .writeTlv(String(this.uin))
            .writeU16(0)
            .read();
        const buf = Buffer.alloc(4);
        buf.writeUInt32BE(this.uin);
        const key = (0, constants_1.md5)(Buffer.concat([
            md5pass, Buffer.alloc(4), buf
        ]));
        return new writer_1.default().writeBytes(tea.encrypt(body, key));
    },
    0x107: function () {
        return new writer_1.default()
            .writeU16(0) // pic type
            .writeU8(0) // captcha type
            .writeU16(0) // pic size
            .writeU8(1); // ret type
    },
    0x109: function () {
        return new writer_1.default().writeBytes((0, constants_1.md5)(this.device.imei));
    },
    0x10a: function () {
        return new writer_1.default().writeBytes(this.sig.tgt);
    },
    0x116: function () {
        return new writer_1.default()
            .writeU8(0)
            .writeU32(this.apk.bitmap)
            .writeU32(0x10400) // sub sigmap
            .writeU8(1) // size of app id list
            .writeU32(1600000226); // app id list[0]
    },
    0x124: function () {
        return new writer_1.default()
            .writeTlv(this.device.os_type.slice(0, 16))
            .writeTlv(this.device.version.release.slice(0, 16))
            .writeU16(2) // network type
            .writeTlv(this.device.sim.slice(0, 16))
            .writeU16(0)
            .writeTlv(this.device.apn.slice(0, 16));
    },
    0x128: function () {
        return new writer_1.default()
            .writeU16(0)
            .writeU8(0) // guid new
            .writeU8(1) // guid available
            .writeU8(0) // guid changed
            .writeU32(16777216) // guid flag
            .writeTlv(this.device.model.slice(0, 32))
            .writeTlv(this.device.guid.slice(0, 16))
            .writeTlv(this.device.brand.slice(0, 16));
    },
    0x141: function () {
        return new writer_1.default()
            .writeU16(1) // ver
            .writeTlv(this.device.sim)
            .writeU16(2) // network type
            .writeTlv(this.device.apn);
    },
    0x142: function () {
        return new writer_1.default()
            .writeU16(0)
            .writeTlv(this.apk.id.slice(0, 32));
    },
    0x143: function () {
        return new writer_1.default().writeBytes(this.sig.d2);
    },
    0x144: function () {
        const body = new writer_1.default()
            .writeU16(5) // tlv cnt
            .writeBytes(packTlv.call(this, 0x109))
            .writeBytes(packTlv.call(this, 0x52d))
            .writeBytes(packTlv.call(this, 0x124))
            .writeBytes(packTlv.call(this, 0x128))
            .writeBytes(packTlv.call(this, 0x16e));
        return new writer_1.default().writeBytes(tea.encrypt(body.read(), this.sig.tgtgt));
    },
    0x145: function () {
        return new writer_1.default().writeBytes(this.device.guid);
    },
    0x147: function () {
        return new writer_1.default()
            .writeU32(this.apk.appid)
            .writeTlv(this.apk.ver.slice(0, 5))
            .writeTlv(this.apk.sign);
    },
    0x154: function () {
        return new writer_1.default().writeU32(this.sig.seq + 1);
    },
    0x16e: function () {
        return new writer_1.default().writeBytes(this.device.model);
    },
    0x174: function () {
        return new writer_1.default().writeBytes(this.sig.t174);
    },
    0x177: function () {
        return new writer_1.default()
            .writeU8(0x01)
            .writeU32(this.apk.buildtime)
            .writeTlv(this.apk.sdkver);
    },
    0x17a: function () {
        return new writer_1.default().writeU32(9);
    },
    0x17c: function (code) {
        return new writer_1.default().writeTlv(code);
    },
    0x187: function () {
        return new writer_1.default().writeBytes((0, constants_1.md5)(this.device.mac_address));
    },
    0x188: function () {
        return new writer_1.default().writeBytes((0, constants_1.md5)(this.device.android_id));
    },
    0x191: function () {
        return new writer_1.default().writeU8(0x82);
    },
    0x193: function (ticket) {
        return new writer_1.default().writeBytes(ticket);
    },
    0x194: function () {
        return new writer_1.default().writeBytes(this.device.imsi);
    },
    0x197: function () {
        return new writer_1.default().writeTlv(Buffer.alloc(1));
    },
    0x198: function () {
        return new writer_1.default().writeTlv(Buffer.alloc(1));
    },
    0x202: function () {
        return new writer_1.default()
            .writeTlv(this.device.wifi_bssid.slice(0, 16))
            .writeTlv(this.device.wifi_ssid.slice(0, 32));
    },
    0x400: function () {
        return new writer_1.default()
            .writeU16(1)
            .writeU64(this.uin)
            .writeBytes(this.device.guid)
            .writeBytes(crypto.randomBytes(16))
            .write32(1)
            .write32(16)
            .write32(Date.now() & 0xffffffff)
            .writeBytes(Buffer.alloc(0));
    },
    0x401: function () {
        return new writer_1.default().writeBytes(crypto.randomBytes(16));
    },
    0x511: function () {
        const domains = new Set([
            "aq.qq.com",
            "buluo.qq.com",
            "connect.qq.com",
            "docs.qq.com",
            "game.qq.com",
            "gamecenter.qq.com",
            // "graph.qq.com",
            "haoma.qq.com",
            "id.qq.com",
            // "imgcache.qq.com",
            "kg.qq.com",
            "mail.qq.com",
            "mma.qq.com",
            "office.qq.com",
            // "om.qq.com",
            "openmobile.qq.com",
            "qqweb.qq.com",
            "qun.qq.com",
            "qzone.qq.com",
            "ti.qq.com",
            "v.qq.com",
            "vip.qq.com",
            "y.qq.com",
        ]);
        const stream = new writer_1.default().writeU16(domains.size);
        for (let v of domains)
            stream.writeU8(0x01).writeTlv(v);
        return stream;
    },
    0x516: function () {
        return new writer_1.default().writeU32(0);
    },
    0x521: function () {
        return new writer_1.default()
            .writeU32(0) // product type
            .writeU16(0); // const
    },
    0x525: function () {
        return new writer_1.default()
            .writeU16(1) // tlv cnt
            .writeU16(0x536) // tag
            .writeTlv(Buffer.from([0x1, 0x0])); // zero
    },
    0x52d: function () {
        const d = this.device;
        const buf = pb.encode({
            1: d.bootloader,
            2: d.proc_version,
            3: d.version.codename,
            4: d.version.incremental,
            5: d.fingerprint,
            6: d.boot_id,
            7: d.android_id,
            8: d.baseband,
            9: d.version.incremental,
        });
        return new writer_1.default().writeBytes(buf);
    },
};
function getPacker(c) {
    return packTlv.bind(c);
}
exports.getPacker = getPacker;
