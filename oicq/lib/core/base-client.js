"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClient = exports.QrcodeResult = exports.ApiRejection = exports.VerboseLevel = void 0;
const events_1 = require("events");
const crypto_1 = require("crypto");
const stream_1 = require("stream");
const network_1 = __importDefault(require("./network"));
const ecdh_1 = __importDefault(require("./ecdh"));
const writer_1 = __importDefault(require("./writer"));
const tlv = __importStar(require("./tlv"));
const tea = __importStar(require("./tea"));
const pb = __importStar(require("./protobuf"));
const jce = __importStar(require("./jce"));
const constants_1 = require("./constants");
const device_1 = require("./device");
const FN_NEXT_SEQ = Symbol("FN_NEXT_SEQ");
const FN_SEND = Symbol("FN_SEND");
const FN_SEND_LOGIN = Symbol("FN_SEND_LOGIN");
const HANDLERS = Symbol("HANDLERS");
const NET = Symbol("NET");
const ECDH = Symbol("ECDH");
const IS_ONLINE = Symbol("IS_ONLINE");
const LOGIN_LOCK = Symbol("LOGIN_LOCK");
const HEARTBEAT = Symbol("HEARTBEAT");
var VerboseLevel;
(function (VerboseLevel) {
    VerboseLevel[VerboseLevel["Fatal"] = 0] = "Fatal";
    VerboseLevel[VerboseLevel["Mark"] = 1] = "Mark";
    VerboseLevel[VerboseLevel["Error"] = 2] = "Error";
    VerboseLevel[VerboseLevel["Warn"] = 3] = "Warn";
    VerboseLevel[VerboseLevel["Info"] = 4] = "Info";
    VerboseLevel[VerboseLevel["Debug"] = 5] = "Debug";
})(VerboseLevel = exports.VerboseLevel || (exports.VerboseLevel = {}));
class ApiRejection {
    constructor(code, message = "unknown") {
        this.code = code;
        this.message = message;
        this.code = Number(this.code);
        this.message = this.message?.toString() || "unknown";
    }
}
exports.ApiRejection = ApiRejection;
var QrcodeResult;
(function (QrcodeResult) {
    QrcodeResult[QrcodeResult["OtherError"] = 0] = "OtherError";
    QrcodeResult[QrcodeResult["Timeout"] = 17] = "Timeout";
    QrcodeResult[QrcodeResult["WaitingForScan"] = 48] = "WaitingForScan";
    QrcodeResult[QrcodeResult["WaitingForConfirm"] = 53] = "WaitingForConfirm";
    QrcodeResult[QrcodeResult["Canceled"] = 54] = "Canceled";
})(QrcodeResult = exports.QrcodeResult || (exports.QrcodeResult = {}));
class BaseClient extends events_1.EventEmitter {
    constructor(uin, p = device_1.Platform.Android, d) {
        super();
        this.uin = uin;
        this[_a] = false;
        this[_b] = false;
        this[_c] = new ecdh_1.default;
        this[_d] = new network_1.default;
        // 回包的回调函数
        this[_e] = new Map();
        this.sig = {
            seq: (0, crypto_1.randomBytes)(4).readUInt32BE() & 0xfff,
            session: (0, crypto_1.randomBytes)(4),
            randkey: (0, crypto_1.randomBytes)(16),
            tgtgt: (0, crypto_1.randomBytes)(16),
            tgt: constants_1.BUF0,
            skey: constants_1.BUF0,
            d2: constants_1.BUF0,
            d2key: constants_1.BUF0,
            t104: constants_1.BUF0,
            t174: constants_1.BUF0,
            qrsig: constants_1.BUF0,
            /** 大数据上传通道 */
            bigdata: {
                ip: "",
                port: 0,
                sig_session: constants_1.BUF0,
                session_key: constants_1.BUF0,
            },
            /** 心跳包 */
            hb480: (() => {
                const buf = Buffer.alloc(9);
                buf.writeUInt32BE(this.uin);
                buf.writeInt32BE(0x19e39, 5);
                return pb.encode({
                    1: 1152,
                    2: 9,
                    4: buf
                });
            })(),
            /** 上次cookie刷新时间 */
            emp_time: 0,
            time_diff: 0,
        };
        this.pskey = {};
        /** 心跳间隔(秒) */
        this.interval = 30;
        /** 随心跳一起触发的函数，可以随意设定 */
        this.heartbeat = constants_1.NOOP;
        /** 数据统计 */
        this.statistics = {
            start_time: (0, constants_1.timestamp)(),
            lost_times: 0,
            recv_pkt_cnt: 0,
            sent_pkt_cnt: 0,
            lost_pkt_cnt: 0,
            recv_msg_cnt: 0,
            sent_msg_cnt: 0,
            msg_cnt_per_min: 0,
            remote_ip: "",
            remote_port: 0,
        };
        this.apk = (0, device_1.getApkInfo)(p);
        this.device = (0, device_1.generateFullDevice)(d || uin);
        this[NET].on("error", err => this.emit("internal.verbose", err.message, VerboseLevel.Error));
        this[NET].on("close", () => {
            this.statistics.remote_ip = "";
            this.statistics.remote_port = 0;
            this[NET].remoteAddress && this.emit("internal.verbose", `${this[NET].remoteAddress}:${this[NET].remotePort} closed`, VerboseLevel.Mark);
        });
        this[NET].on("connect2", () => {
            this.statistics.remote_ip = this[NET].remoteAddress;
            this.statistics.remote_port = this[NET].remotePort;
            this.emit("internal.verbose", `${this[NET].remoteAddress}:${this[NET].remotePort} connected`, VerboseLevel.Mark);
            syncTimeDiff.call(this);
        });
        this[NET].on("packet", packetListener.bind(this));
        this[NET].on("lost", lostListener.bind(this));
        this.on("internal.online", onlineListener);
        this.on("internal.sso", ssoListener);
        (0, constants_1.lock)(this, "uin");
        (0, constants_1.lock)(this, "apk");
        (0, constants_1.lock)(this, "device");
        (0, constants_1.lock)(this, "sig");
        (0, constants_1.lock)(this, "pskey");
        (0, constants_1.lock)(this, "statistics");
        (0, constants_1.hide)(this, "heartbeat");
        (0, constants_1.hide)(this, "interval");
    }
    /** 设置连接服务器，不设置则自动搜索 */
    setRemoteServer(host, port) {
        if (host && port) {
            this[NET].host = host;
            this[NET].port = port;
            this[NET].auto_search = false;
        }
        else {
            this[NET].auto_search = true;
        }
    }
    /** 是否为在线状态 (可以收发业务包的状态) */
    isOnline() {
        return this[IS_ONLINE];
    }
    /** 下线 (keepalive: 是否保持tcp连接) */
    async logout(keepalive = false) {
        await register.call(this, true);
        if (!keepalive && this[NET].connected) {
            this.terminate();
            await new Promise(resolve => this[NET].once("close", resolve));
        }
    }
    /** 关闭连接 */
    terminate() {
        this[IS_ONLINE] = false;
        this[NET].destroy();
    }
    /** 使用接收到的token登录 */
    tokenLogin(token) {
        if (![144, 152].includes(token.length))
            throw new Error("bad token");
        this.sig.session = (0, crypto_1.randomBytes)(4);
        this.sig.randkey = (0, crypto_1.randomBytes)(16);
        this[ECDH] = new ecdh_1.default;
        this.sig.d2key = token.slice(0, 16);
        this.sig.d2 = token.slice(16, token.length - 72);
        this.sig.tgt = token.slice(token.length - 72);
        this.sig.tgtgt = (0, constants_1.md5)(this.sig.d2key);
        const t = tlv.getPacker(this);
        const body = new writer_1.default()
            .writeU16(11)
            .writeU16(16)
            .writeBytes(t(0x100))
            .writeBytes(t(0x10a))
            .writeBytes(t(0x116))
            .writeBytes(t(0x144))
            .writeBytes(t(0x143))
            .writeBytes(t(0x142))
            .writeBytes(t(0x154))
            .writeBytes(t(0x18))
            .writeBytes(t(0x141))
            .writeBytes(t(0x8))
            .writeBytes(t(0x147))
            .writeBytes(t(0x177))
            .writeBytes(t(0x187))
            .writeBytes(t(0x188))
            .writeBytes(t(0x202))
            .writeBytes(t(0x511))
            .read();
        this[FN_SEND_LOGIN]("wtlogin.exchange_emp", body);
    }
    /**
     * 使用密码登录
     * @param md5pass 密码的md5值
     */
    passwordLogin(md5pass) {
        this.sig.session = (0, crypto_1.randomBytes)(4);
        this.sig.randkey = (0, crypto_1.randomBytes)(16);
        this.sig.tgtgt = (0, crypto_1.randomBytes)(16);
        this[ECDH] = new ecdh_1.default;
        const t = tlv.getPacker(this);
        let body = new writer_1.default()
            .writeU16(9)
            .writeU16(23)
            .writeBytes(t(0x18))
            .writeBytes(t(0x1))
            .writeBytes(t(0x106, md5pass))
            .writeBytes(t(0x116))
            .writeBytes(t(0x100))
            .writeBytes(t(0x107))
            .writeBytes(t(0x142))
            .writeBytes(t(0x144))
            .writeBytes(t(0x145))
            .writeBytes(t(0x147))
            .writeBytes(t(0x154))
            .writeBytes(t(0x141))
            .writeBytes(t(0x8))
            .writeBytes(t(0x511))
            .writeBytes(t(0x187))
            .writeBytes(t(0x188))
            .writeBytes(t(0x194))
            .writeBytes(t(0x191))
            .writeBytes(t(0x202))
            .writeBytes(t(0x177))
            .writeBytes(t(0x516))
            .writeBytes(t(0x521))
            .writeBytes(t(0x525))
            .read();
        this[FN_SEND_LOGIN]("wtlogin.login", body);
    }
    /** 收到滑动验证码后，用于提交滑动验证码 */
    submitSlider(ticket) {
        ticket = String(ticket).trim();
        const t = tlv.getPacker(this);
        const body = new writer_1.default()
            .writeU16(2)
            .writeU16(4)
            .writeBytes(t(0x193, ticket))
            .writeBytes(t(0x8))
            .writeBytes(t(0x104))
            .writeBytes(t(0x116))
            .read();
        this[FN_SEND_LOGIN]("wtlogin.login", body);
    }
    /** 收到设备锁验证请求后，用于发短信 */
    sendSmsCode() {
        const t = tlv.getPacker(this);
        const body = new writer_1.default()
            .writeU16(8)
            .writeU16(6)
            .writeBytes(t(0x8))
            .writeBytes(t(0x104))
            .writeBytes(t(0x116))
            .writeBytes(t(0x174))
            .writeBytes(t(0x17a))
            .writeBytes(t(0x197))
            .read();
        this[FN_SEND_LOGIN]("wtlogin.login", body);
    }
    /** 提交短信验证码 */
    submitSmsCode(code) {
        code = String(code).trim();
        if (Buffer.byteLength(code) !== 6)
            code = "123456";
        const t = tlv.getPacker(this);
        const body = new writer_1.default()
            .writeU16(7)
            .writeU16(7)
            .writeBytes(t(0x8))
            .writeBytes(t(0x104))
            .writeBytes(t(0x116))
            .writeBytes(t(0x174))
            .writeBytes(t(0x17c, code))
            .writeBytes(t(0x401))
            .writeBytes(t(0x198))
            .read();
        this[FN_SEND_LOGIN]("wtlogin.login", body);
    }
    /** 获取登录二维码(模拟手表协议扫码登录) */
    fetchQrcode() {
        const t = tlv.getPacker(this);
        const body = new writer_1.default()
            .writeU16(0)
            .writeU32(16)
            .writeU64(0)
            .writeU8(8)
            .writeTlv(constants_1.BUF0)
            .writeU16(6)
            .writeBytes(t(0x16))
            .writeBytes(t(0x1B))
            .writeBytes(t(0x1D))
            .writeBytes(t(0x1F))
            .writeBytes(t(0x33))
            .writeBytes(t(0x35))
            .read();
        const pkt = buildCode2dPacket.call(this, 0x31, 0x11100, body);
        this[FN_SEND](pkt).then(payload => {
            payload = tea.decrypt(payload.slice(16, -1), this[ECDH].share_key);
            const stream = stream_1.Readable.from(payload, { objectMode: false });
            stream.read(54);
            const retcode = stream.read(1)[0];
            const qrsig = stream.read(stream.read(2).readUInt16BE());
            stream.read(2);
            const t = readTlv(stream);
            if (!retcode && t[0x17]) {
                this.sig.qrsig = qrsig;
                this.emit("internal.qrcode", t[0x17]);
            }
            else {
                this.emit("internal.error.qrcode", retcode, "获取二维码失败，请重试");
            }
        }).catch(() => this.emit("internal.error.network", -2, "server is busy"));
    }
    /** 获取登录二维码(模拟手表协议扫码登录) */
	async fetchQrcode_1() {
	    const t = tlv.getPacker(this);
	    const body = new writer_1.default()
	        .writeU16(0)
	        .writeU32(16)
	        .writeU64(0)
	        .writeU8(8)
	        .writeTlv(constants_1.BUF0)
	        .writeU16(6)
	        .writeBytes(t(0x16))
	        .writeBytes(t(0x1B))
	        .writeBytes(t(0x1D))
	        .writeBytes(t(0x1F))
	        .writeBytes(t(0x33))
	        .writeBytes(t(0x35))
	        .read();
	    const pkt = buildCode2dPacket.call(this, 0x31, 0x11100, body);


        try {
            let payload = await this[FN_SEND](pkt);
            payload = tea.decrypt(payload.slice(16, -1), this[ECDH].share_key);
	        const stream = stream_1.Readable.from(payload, { objectMode: false });
	        stream.read(54);
	        const retcode = stream.read(1)[0];
	        const qrsig = stream.read(stream.read(2).readUInt16BE());
	        stream.read(2);
	        const t = readTlv(stream);
			// console.log('+++++++++TTTTT', t);
			// console.log('+++++++++t[0x17]t[0x17]t[0x17]t[0x17]', t[0x17]);
	        if (!retcode && t[0x17]) {
	            this.sig.qrsig = qrsig;
				// console.log('+++++++++qrsig', qrsig);
	            // this.emit("internal.qrcode", t[0x17]);
				return {
					status: 200,
					data: t[0x17]
				}
	        }
	        else {
	            // this.emit("internal.error.qrcode", retcode, "获取二维码失败，请重试");
				return {
					status: 400,
					data: null
				};
			}
        } catch (error) {
            this.emit("internal.error.network", -2, "server is busy")
        }
	}
    /** 扫码后调用此方法登录 */
    async qrcodeLogin() {
        const { retcode, uin, t106, t16a, t318, tgtgt } = await this.queryQrcodeResult();
        if (retcode < 0) {
            this.emit("internal.error.network", -2, "server is busy");
        }
        else if (retcode === 0 && t106 && t16a && t318 && tgtgt) {
            this.sig.qrsig = constants_1.BUF0;
            if (uin !== this.uin) {
                this.emit("internal.error.qrcode", retcode, `扫码账号(${uin})与登录账号(${this.uin})不符`);
                return;
            }
            this.sig.tgtgt = tgtgt;
            const t = tlv.getPacker(this);
            const body = new writer_1.default()
                .writeU16(9)
                .writeU16(24)
                .writeBytes(t(0x18))
                .writeBytes(t(0x1))
                .writeU16(0x106)
                .writeTlv(t106)
                .writeBytes(t(0x116))
                .writeBytes(t(0x100))
                .writeBytes(t(0x107))
                .writeBytes(t(0x142))
                .writeBytes(t(0x144))
                .writeBytes(t(0x145))
                .writeBytes(t(0x147))
                .writeU16(0x16a)
                .writeTlv(t16a)
                .writeBytes(t(0x154))
                .writeBytes(t(0x141))
                .writeBytes(t(0x8))
                .writeBytes(t(0x511))
                .writeBytes(t(0x187))
                .writeBytes(t(0x188))
                .writeBytes(t(0x194))
                .writeBytes(t(0x191))
                .writeBytes(t(0x202))
                .writeBytes(t(0x177))
                .writeBytes(t(0x516))
                .writeBytes(t(0x521))
                .writeU16(0x318)
                .writeTlv(t318)
                .read();
            this[FN_SEND_LOGIN]("wtlogin.login", body);
        }
        else {
            let message;
            switch (retcode) {
                case QrcodeResult.Timeout:
                    message = "二维码超时，请重新获取";
                    break;
                case QrcodeResult.WaitingForScan:
                    message = "二维码尚未扫描";
                    break;
                case QrcodeResult.WaitingForConfirm:
                    message = "二维码尚未确认";
                    break;
                case QrcodeResult.Canceled:
                    message = "二维码被取消，请重新获取";
                    break;
                default:
                    message = "扫码遇到未知错误，请重新获取";
                    break;
            }
            this.sig.qrsig = constants_1.BUF0;
            this.emit("internal.error.qrcode", retcode, message);
        }
    }
    /** 获取扫码结果(可定时查询，retcode为0则调用qrcodeLogin登录) */
    async queryQrcodeResult() {
        let retcode = -1, uin, t106, t16a, t318, tgtgt;
        if (!this.sig.qrsig.length)
            return { retcode, uin, t106, t16a, t318, tgtgt };
        const body = new writer_1.default()
            .writeU16(5)
            .writeU8(1)
            .writeU32(8)
            .writeU32(16)
            .writeTlv(this.sig.qrsig)
            .writeU64(0)
            .writeU8(8)
            .writeTlv(constants_1.BUF0)
            .writeU16(0)
            .read();
        const pkt = buildCode2dPacket.call(this, 0x12, 0x6200, body);
        try {
            let payload = await this[FN_SEND](pkt);
            payload = tea.decrypt(payload.slice(16, -1), this[ECDH].share_key);
            const stream = stream_1.Readable.from(payload, { objectMode: false });
            stream.read(48);
            let len = stream.read(2).readUInt16BE();
            if (len > 0) {
                len--;
                if (stream.read(1)[0] === 2) {
                    stream.read(8);
                    len -= 8;
                }
                if (len > 0)
                    stream.read(len);
            }
            stream.read(4);
            retcode = stream.read(1)[0];
            if (retcode === 0) {
                stream.read(4);
                uin = stream.read(4).readUInt32BE();
                stream.read(6);
                const t = readTlv(stream);
                t106 = t[0x18];
                t16a = t[0x19];
                t318 = t[0x65];
                tgtgt = t[0x1e];
            }
        }
        catch { }
        return { retcode, uin, t106, t16a, t318, tgtgt };
    }
    [(_a = IS_ONLINE, _b = LOGIN_LOCK, _c = ECDH, _d = NET, _e = HANDLERS, FN_NEXT_SEQ)]() {
        if (++this.sig.seq >= 0x8000)
            this.sig.seq = 1;
        return this.sig.seq;
    }
    [FN_SEND](pkt, timeout = 5) {
        this.statistics.sent_pkt_cnt++;
        const seq = this.sig.seq;
        return new Promise((resolve, reject) => {
            const id = setTimeout(() => {
                this[HANDLERS].delete(seq);
                this.statistics.lost_pkt_cnt++;
                reject(new ApiRejection(-2, `packet timeout (${seq})`));
            }, timeout * 1000);
            this[NET].join(() => {
                this[NET].write(pkt, () => {
                    this[HANDLERS].set(seq, (payload) => {
                        clearTimeout(id);
                        this[HANDLERS].delete(seq);
                        resolve(payload);
                    });
                });
            });
        });
    }
    async [FN_SEND_LOGIN](cmd, body) {
        if (this[IS_ONLINE] || this[LOGIN_LOCK])
            return;
        const pkt = buildLoginPacket.call(this, cmd, body);
        try {
            this[LOGIN_LOCK] = true;
            decodeLoginResponse.call(this, await this[FN_SEND](pkt));
        }
        catch (e) {
            this[LOGIN_LOCK] = false;
            this.emit("internal.error.network", -2, "server is busy");
            this.emit("internal.verbose", e.message, VerboseLevel.Error);
        }
    }
    /** 发送一个业务包不等待返回 */
    writeUni(cmd, body, seq = 0) {
        this.statistics.sent_pkt_cnt++;
        this[NET].write(buildUniPkt.call(this, cmd, body, seq));
    }
    /** 发送一个业务包并等待返回 */
    async sendUni(cmd, body, timeout = 5) {
        if (!this[IS_ONLINE])
            throw new ApiRejection(-1, `client not online`);
        return this[FN_SEND](buildUniPkt.call(this, cmd, body), timeout);
    }
}
exports.BaseClient = BaseClient;
function buildUniPkt(cmd, body, seq = 0) {
    seq = seq || this[FN_NEXT_SEQ]();
    this.emit("internal.verbose", `send:${cmd} seq:${seq}`, VerboseLevel.Debug);
    let len = cmd.length + 20;
    const sso = Buffer.allocUnsafe(len + body.length + 4);
    sso.writeUInt32BE(len, 0);
    sso.writeUInt32BE(cmd.length + 4, 4);
    sso.fill(cmd, 8);
    let offset = cmd.length + 8;
    sso.writeUInt32BE(8, offset);
    sso.fill(this.sig.session, offset + 4);
    sso.writeUInt32BE(4, offset + 8);
    sso.writeUInt32BE(body.length + 4, offset + 12);
    sso.fill(body, offset + 16);
    const encrypted = tea.encrypt(sso, this.sig.d2key);
    const uin = String(this.uin);
    len = encrypted.length + uin.length + 18;
    const pkt = Buffer.allocUnsafe(len);
    pkt.writeUInt32BE(len, 0);
    pkt.writeUInt32BE(0x0B, 4);
    pkt.writeUInt8(1, 8); //type
    pkt.writeInt32BE(seq, 9);
    pkt.writeUInt8(0, 13);
    pkt.writeUInt32BE(uin.length + 4, 14);
    pkt.fill(uin, 18);
    pkt.fill(encrypted, uin.length + 18);
    return pkt;
}
const EVENT_KICKOFF = Symbol("EVENT_KICKOFF");
function ssoListener(cmd, payload, seq) {
    switch (cmd) {
        case "StatSvc.ReqMSFOffline":
        case "MessageSvc.PushForceOffline":
            {
                const nested = jce.decodeWrapper(payload);
                const msg = nested[4] ? `[${nested[4]}]${nested[3]}` : `[${nested[1]}]${nested[2]}`;
                this.emit(EVENT_KICKOFF, msg);
            }
            break;
        case "QualityTest.PushList":
        case "OnlinePush.SidTicketExpired":
            this.writeUni(cmd, constants_1.BUF0, seq);
            break;
        case "ConfigPushSvc.PushReq":
            {
                if (payload[0] === 0)
                    payload = payload.slice(4);
                const nested = jce.decodeWrapper(payload);
                if (nested[1] === 2 && nested[2]) {
                    const buf = jce.decode(nested[2])[5][5];
                    const decoded = pb.decode(buf)[1281];
                    this.sig.bigdata.sig_session = decoded[1].toBuffer();
                    this.sig.bigdata.session_key = decoded[2].toBuffer();
                    for (let v of decoded[3]) {
                        if (v[1] === 10) {
                            this.sig.bigdata.port = v[2][0][3];
                            this.sig.bigdata.ip = (0, constants_1.int32ip2str)(v[2][0][2]);
                        }
                    }
                }
            }
            break;
    }
}
function onlineListener() {
    if (!this.listenerCount(EVENT_KICKOFF)) {
        this.once(EVENT_KICKOFF, (msg) => {
            this[IS_ONLINE] = false;
            clearInterval(this[HEARTBEAT]);
            this.emit("internal.kickoff", msg);
        });
    }
}
function lostListener() {
    clearInterval(this[HEARTBEAT]);
    if (this[IS_ONLINE]) {
        this[IS_ONLINE] = false;
        this.statistics.lost_times++;
        setTimeout(register.bind(this), 50);
    }
}
async function parseSso(buf) {
    const headlen = buf.readUInt32BE();
    const seq = buf.readInt32BE(4);
    const retcode = buf.readInt32BE(8);
    if (retcode !== 0) {
        this.emit("internal.error.token");
        throw new Error("unsuccessful retcode: " + retcode);
    }
    let offset = buf.readUInt32BE(12) + 12;
    let len = buf.readUInt32BE(offset); // length of cmd
    const cmd = String(buf.slice(offset + 4, offset + len));
    offset += len;
    len = buf.readUInt32BE(offset); // length of session_id
    offset += len;
    const flag = buf.readInt32BE(offset);
    let payload;
    if (flag === 0)
        payload = buf.slice(headlen + 4);
    else if (flag === 1)
        payload = await (0, constants_1.unzip)(buf.slice(headlen + 4));
    else if (flag === 8)
        payload = buf.slice(headlen);
    else
        throw new Error("unknown compressed flag: " + flag);
    return {
        seq, cmd, payload
    };
}
async function packetListener(pkt) {
    this.statistics.recv_pkt_cnt++;
    this[LOGIN_LOCK] = false;
    try {
        const flag = pkt.readUInt8(4);
        const encrypted = pkt.slice(pkt.readUInt32BE(6) + 6);
        let decrypted;
        switch (flag) {
            case 0:
                decrypted = encrypted;
                break;
            case 1:
                decrypted = tea.decrypt(encrypted, this.sig.d2key);
                break;
            case 2:
                decrypted = tea.decrypt(encrypted, constants_1.BUF16);
                break;
            default:
                this.emit("internal.error.token");
                throw new Error("unknown flag:" + flag);
        }
        const sso = await parseSso.call(this, decrypted);
        this.emit("internal.verbose", `recv:${sso.cmd} seq:${sso.seq}`, VerboseLevel.Debug);
        if (this[HANDLERS].has(sso.seq))
            this[HANDLERS].get(sso.seq)?.(sso.payload);
        else
            this.emit("internal.sso", sso.cmd, sso.payload, sso.seq);
    }
    catch (e) {
        this.emit("internal.verbose", e, VerboseLevel.Error);
    }
}
async function register(logout = false, reflush = false) {
    this[IS_ONLINE] = false;
    clearInterval(this[HEARTBEAT]);
    const pb_buf = pb.encode({
        1: [
            { 1: 46, 2: (0, constants_1.timestamp)() },
            { 1: 283, 2: 0 }
        ]
    });
    const d = this.device;
    const SvcReqRegister = jce.encodeStruct([
        this.uin,
        (logout ? 0 : 7), 0, "", (logout ? 21 : 11), 0,
        0, 0, 0, 0, (logout ? 44 : 0),
        d.version.sdk, 1, "", 0, null,
        d.guid, 2052, 0, d.model, d.model,
        d.version.release, 1, 0, 0, null,
        0, 0, "", 0, d.brand,
        d.brand, "", pb_buf, 0, null,
        0, null, 1000, 98
    ]);
    const body = jce.encodeWrapper({ SvcReqRegister }, "PushService", "SvcReqRegister");
    const pkt = buildLoginPacket.call(this, "StatSvc.register", body, 1);
    try {
        const payload = await this[FN_SEND](pkt, 10);
        if (logout)
            return;
        const rsp = jce.decodeWrapper(payload);
        const result = rsp[9] ? true : false;
        if (!result && !reflush) {
            this.emit("internal.error.token");
        }
        else {
            this[IS_ONLINE] = true;
            this[HEARTBEAT] = setInterval(async () => {
                syncTimeDiff.call(this);
                if (typeof this.heartbeat === "function")
                    await this.heartbeat();
                this.sendUni("OidbSvc.0x480_9_IMCore", this.sig.hb480).catch(() => {
                    this.emit("internal.verbose", "heartbeat timeout", VerboseLevel.Warn);
                    this.sendUni("OidbSvc.0x480_9_IMCore", this.sig.hb480).catch(() => {
                        this.emit("internal.verbose", "heartbeat timeout x 2", VerboseLevel.Error);
                        this[NET].destroy();
                    });
                }).then(refreshToken.bind(this));
            }, this.interval * 1000);
        }
    }
    catch {
        if (!logout)
            this.emit("internal.error.network", -3, "server is busy(register)");
    }
}
function syncTimeDiff() {
    const pkt = buildLoginPacket.call(this, "Client.CorrectTime", constants_1.BUF4, 0);
    this[FN_SEND](pkt).then(buf => {
        try {
            this.sig.time_diff = buf.readInt32BE() - (0, constants_1.timestamp)();
        }
        catch { }
    }).catch(constants_1.NOOP);
}
async function refreshToken() {
    if (!this.isOnline() || (0, constants_1.timestamp)() - this.sig.emp_time < 14000)
        return;
    const t = tlv.getPacker(this);
    const body = new writer_1.default()
        .writeU16(11)
        .writeU16(16)
        .writeBytes(t(0x100))
        .writeBytes(t(0x10a))
        .writeBytes(t(0x116))
        .writeBytes(t(0x144))
        .writeBytes(t(0x143))
        .writeBytes(t(0x142))
        .writeBytes(t(0x154))
        .writeBytes(t(0x18))
        .writeBytes(t(0x141))
        .writeBytes(t(0x8))
        .writeBytes(t(0x147))
        .writeBytes(t(0x177))
        .writeBytes(t(0x187))
        .writeBytes(t(0x188))
        .writeBytes(t(0x202))
        .writeBytes(t(0x511))
        .read();
    const pkt = buildLoginPacket.call(this, "wtlogin.exchange_emp", body);
    try {
        let payload = await this[FN_SEND](pkt);
        payload = tea.decrypt(payload.slice(16, payload.length - 1), this[ECDH].share_key);
        const stream = stream_1.Readable.from(payload, { objectMode: false });
        stream.read(2);
        const type = stream.read(1).readUInt8();
        stream.read(2);
        const t = readTlv(stream);
        if (type === 0) {
            const { token } = decodeT119.call(this, t[0x119]);
            await register.call(this, false, true);
            if (this[IS_ONLINE])
                this.emit("internal.token", token);
        }
    }
    catch (e) {
        this.emit("internal.verbose", "refresh token error: " + e?.message, VerboseLevel.Error);
    }
}
function readTlv(r) {
    const t = {};
    while (r.readableLength > 2) {
        const k = r.read(2).readUInt16BE();
        t[k] = r.read(r.read(2).readUInt16BE());
    }
    return t;
}
function buildLoginPacket(cmd, body, type = 2) {
    this[FN_NEXT_SEQ]();
    this.emit("internal.verbose", `send:${cmd} seq:${this.sig.seq}`, VerboseLevel.Debug);
    let uin = this.uin, cmdid = 0x810, subappid = this.apk.subid;
    if (cmd === "wtlogin.trans_emp") {
        uin = 0;
        cmdid = 0x812;
        subappid = (0, device_1.getApkInfo)(device_1.Platform.Watch).subid;
    }
    if (type === 2) {
        body = new writer_1.default()
            .writeU8(0x02)
            .writeU8(0x01)
            .writeBytes(this.sig.randkey)
            .writeU16(0x131)
            .writeU16(0x01)
            .writeTlv(this[ECDH].public_key)
            .writeBytes(tea.encrypt(body, this[ECDH].share_key))
            .read();
        body = new writer_1.default()
            .writeU8(0x02)
            .writeU16(29 + body.length) // 1 + 27 + body.length + 1
            .writeU16(8001) // protocol ver
            .writeU16(cmdid) // command id
            .writeU16(1) // const
            .writeU32(uin)
            .writeU8(3) // const
            .writeU8(0x87) // encrypt type 7:0 69:emp 0x87:4
            .writeU8(0) // const
            .writeU32(2) // const
            .writeU32(0) // app client ver
            .writeU32(0) // const
            .writeBytes(body)
            .writeU8(0x03)
            .read();
    }
    let sso = new writer_1.default()
        .writeWithLength(new writer_1.default()
            .writeU32(this.sig.seq)
            .writeU32(subappid)
            .writeU32(subappid)
            .writeBytes(Buffer.from([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00]))
            .writeWithLength(this.sig.tgt)
            .writeWithLength(cmd)
            .writeWithLength(this.sig.session)
            .writeWithLength(this.device.imei)
            .writeU32(4)
            .writeU16(2)
            .writeU32(4)
            .read())
        .writeWithLength(body)
        .read();
    if (type === 1)
        sso = tea.encrypt(sso, this.sig.d2key);
    else if (type === 2)
        sso = tea.encrypt(sso, constants_1.BUF16);
    return new writer_1.default()
        .writeWithLength(new writer_1.default()
            .writeU32(0x0A)
            .writeU8(type)
            .writeWithLength(this.sig.d2)
            .writeU8(0)
            .writeWithLength(String(uin))
            .writeBytes(sso)
            .read())
        .read();
}
function buildCode2dPacket(cmdid, head, body) {
    body = new writer_1.default()
        .writeU32(head)
        .writeU32(0x1000)
        .writeU16(0)
        .writeU32(0x72000000)
        .writeU32((0, constants_1.timestamp)())
        .writeU8(2)
        .writeU16(44 + body.length)
        .writeU16(cmdid)
        .writeBytes(Buffer.alloc(21))
        .writeU8(3)
        .writeU16(0)
        .writeU16(50)
        .writeU32(this.sig.seq + 1)
        .writeU64(0)
        .writeBytes(body)
        .writeU8(3)
        .read();
    return buildLoginPacket.call(this, "wtlogin.trans_emp", body);
}
function decodeT119(t119) {
    const r = stream_1.Readable.from(tea.decrypt(t119, this.sig.tgtgt), { objectMode: false });
    r.read(2);
    const t = readTlv(r);
    this.sig.tgt = t[0x10a];
    this.sig.skey = t[0x120];
    this.sig.d2 = t[0x143];
    this.sig.d2key = t[0x305];
    this.sig.tgtgt = (0, constants_1.md5)(this.sig.d2key);
    this.sig.emp_time = (0, constants_1.timestamp)();
    if (t[0x512]) {
        const r = stream_1.Readable.from(t[0x512], { objectMode: false });
        let len = r.read(2).readUInt16BE();
        while (len-- > 0) {
            const domain = String(r.read(r.read(2).readUInt16BE()));
            const pskey = r.read(r.read(2).readUInt16BE());
            const pt4token = r.read(r.read(2).readUInt16BE());
            this.pskey[domain] = pskey;
        }
    }
    const token = Buffer.concat([
        this.sig.d2key,
        this.sig.d2,
        this.sig.tgt,
    ]);
    const age = t[0x11a].slice(2, 3).readUInt8();
    const gender = t[0x11a].slice(3, 4).readUInt8();
    const nickname = String(t[0x11a].slice(5));
    return { token, nickname, gender, age };
}
function decodeLoginResponse(payload) {
    payload = tea.decrypt(payload.slice(16, payload.length - 1), this[ECDH].share_key);
    const r = stream_1.Readable.from(payload, { objectMode: false });
    r.read(2);
    const type = r.read(1).readUInt8();
    r.read(2);
    const t = readTlv(r);
    if (type === 204) {
        this.sig.t104 = t[0x104];
        this.emit("internal.verbose", "unlocking...", VerboseLevel.Mark);
        const tt = tlv.getPacker(this);
        const body = new writer_1.default()
            .writeU16(20)
            .writeU16(4)
            .writeBytes(tt(0x8))
            .writeBytes(tt(0x104))
            .writeBytes(tt(0x116))
            .writeBytes(tt(0x401))
            .read();
        return this[FN_SEND_LOGIN]("wtlogin.login", body);
    }
    if (type === 0) {
        this.sig.t104 = constants_1.BUF0;
        this.sig.t174 = constants_1.BUF0;
        const { token, nickname, gender, age } = decodeT119.call(this, t[0x119]);
        return register.call(this).then(() => {
            if (this[IS_ONLINE])
                this.emit("internal.online", token, nickname, gender, age);
        });
    }
    if (type === 15 || type === 16) {
        return this.emit("internal.error.token");
    }
    if (type === 2) {
        this.sig.t104 = t[0x104];
        if (t[0x192])
            return this.emit("internal.slider", String(t[0x192]));
        return this.emit("internal.error.login", type, "[登陆失败]未知格式的验证码");
    }
    if (type === 160) {
        if (!t[0x204] && !t[0x174])
            return this.emit("internal.verbose", "已向密保手机发送短信验证码", VerboseLevel.Mark);
        let phone = "";
        if (t[0x174] && t[0x178]) {
            this.sig.t104 = t[0x104];
            this.sig.t174 = t[0x174];
            phone = String(t[0x178]).substr(t[0x178].indexOf("\x0b") + 1, 11);
        }
        return this.emit("internal.verify", t[0x204]?.toString() || "", phone);
    }
    if (t[0x149]) {
        const stream = stream_1.Readable.from(t[0x149], { objectMode: false });
        stream.read(2);
        const title = stream.read(stream.read(2).readUInt16BE()).toString();
        const content = stream.read(stream.read(2).readUInt16BE()).toString();
        return this.emit("internal.error.login", type, `[${title}]${content}`);
    }
    if (t[0x146]) {
        const stream = stream_1.Readable.from(t[0x146], { objectMode: false });
        const version = stream.read(4);
        const title = stream.read(stream.read(2).readUInt16BE()).toString();
        const content = stream.read(stream.read(2).readUInt16BE()).toString();
        return this.emit("internal.error.login", type, `[${title}]${content}`);
    }
    this.emit("internal.error.login", type, `[登陆失败]未知错误`);
}
