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
exports.createClient = exports.Client = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const log4js = __importStar(require("log4js"));
const core_1 = require("./core");
const pkg = require("../package.json");
const common_1 = require("./common");
const internal_1 = require("./internal");
const friend_1 = require("./friend");
const group_1 = require("./group");
const member_1 = require("./member");
const message_1 = require("./message");
/** 一个客户端 */
class Client extends core_1.BaseClient {
    //@ts-ignore ts2376??
    constructor(uin, conf) {
        const config = {
            log_level: "info",
            platform: core_1.Platform.Android,
            auto_server: true,
            ignore_self: true,
            resend: true,
            cache_group_member: true,
            reconn_interval: 5,
            data_dir: path.join(require?.main?.path || process.cwd(), "data"),
            ...conf,
        };
        const dir = createDataDir(config.data_dir, uin);
        const file = path.join(dir, `device-${uin}.json`);
        try {
            var device = require(file);
            var _ = false;
        }
        catch {
            var device = (0, core_1.generateShortDevice)(uin);
            var _ = true;
            fs.writeFile(file, JSON.stringify(device, null, 2), common_1.NOOP);
        }
        super(uin, config.platform, device);
        /**
         * 得到一个群对象, 通常不会重复创建，调用
         * @param strict 严格模式，若群不存在会抛出异常
         */
        this.pickGroup = group_1.Group.as.bind(this);
        /** 得到一个好友对象, 通常不会重复创建 */
        this.pickFriend = friend_1.Friend.as.bind(this);
        /** 得到一个群员对象, 通常不会重复创建 */
        this.pickMember = member_1.Member.as.bind(this);
        /** 创建一个用户对象 */
        this.pickUser = friend_1.User.as.bind(this);
        /** 创建一个讨论组对象 */
        this.pickDiscuss = group_1.Discuss.as.bind(this);
        this._cache = new Map();
        /** 好友列表(务必以`ReadonlyMap`方式访问) */
        this.fl = new Map();
        /** 陌生人列表(务必以`ReadonlyMap`方式访问) */
        this.sl = new Map();
        /** 群列表(务必以`ReadonlyMap`方式访问) */
        this.gl = new Map();
        /** 群员列表缓存(务必以`ReadonlyMap`方式访问) */
        this.gml = new Map();
        /** 黑名单列表(务必以`ReadonlySet`方式访问) */
        this.blacklist = new Set();
        /** 好友分组 */
        this.classes = new Map();
        /** 勿手动修改这些属性 */
        this.status = 0;
        this.nickname = "";
        this.sex = "unknown";
        this.age = 0;
        this.bid = "";
        /** 漫游表情缓存 */
        this.stamp = new Set();
        /** 相当于频道中的qq号 */
        this.tiny_id = "";
        this.cookies = new Proxy(this.pskey, {
            get: (obj, domain) => {
                const cookie = `uin=o${this.uin}; skey=${this.sig.skey};`;
                if (!obj[domain])
                    return cookie;
                return `${cookie} p_uin=o${this.uin}; p_skey=${obj[domain]};`;
            },
            set: () => {
                return false;
            }
        });
        this.logger = log4js.getLogger(`[${this.apk.display}:${uin}]`);
        this.logger.level = config.log_level;
        if (_)
            this.logger.mark("创建了新的设备文件：" + file);
        this.logger.mark("----------");
        this.logger.mark(`Package Version: oicq@${pkg.version} (Released on ${pkg.upday})`);
        this.logger.mark("View Changelogs：https://github.com/takayama-lily/oicq/releases");
        this.logger.mark("----------");
        this.dir = dir;
        this.config = config;
        internal_1.bindInternalListeners.call(this);
        this.on("internal.verbose", (verbose, level) => {
            const list = ["fatal", "mark", "error", "warn", "info", "trace"];
            this.logger[list[level]](verbose);
        });
        (0, common_1.lock)(this, "dir");
        (0, common_1.lock)(this, "config");
        (0, common_1.lock)(this, "_cache");
        (0, common_1.lock)(this, "internal");
        (0, common_1.lock)(this, "pickUser");
        (0, common_1.lock)(this, "pickFriend");
        (0, common_1.lock)(this, "pickGroup");
        (0, common_1.lock)(this, "pickDiscuss");
        (0, common_1.lock)(this, "pickMember");
        (0, common_1.lock)(this, "cookies");
        (0, common_1.lock)(this, "fl");
        (0, common_1.lock)(this, "gl");
        (0, common_1.lock)(this, "sl");
        (0, common_1.lock)(this, "gml");
        (0, common_1.lock)(this, "blacklist");
        (0, common_1.hide)(this, "_sync_cookie");
        let n = 0;
        this.heartbeat = () => {
            this._calcMsgCntPerMin();
            n++;
            if (n > 10) {
                n = 0;
                this.setOnlineStatus();
            }
        };
        if (!this.config.auto_server)
            this.setRemoteServer("msfwifi.3g.qq.com", 8080);
    }
    get [Symbol.toStringTag]() {
        return "OicqClient";
    }
    /** csrf token */
    get bkn() {
        let bkn = 5381;
        for (let v of this.sig.skey)
            bkn = bkn + (bkn << 5) + v;
        bkn &= 2147483647;
        return bkn;
    }
    /** 数据统计 */
    get stat() {
        this.statistics.msg_cnt_per_min = this._calcMsgCntPerMin();
        return this.statistics;
    }
    /** 修改日志级别 */
    set log_level(level) {
        this.logger.level = level;
        this.config.log_level = level;
    }
    /**
     * 会优先尝试使用token登录 (token在上次登录成功后存放在`this.dir`下)
     *
     * 无token或token失效时：
     * * 传了`password`则尝试密码登录
     * * 不传`password`则尝试扫码登录
     *
     * 掉线重连时也是自动调用此函数，走相同逻辑
     * 你也可以在配置中修改`reconn_interval`，关闭掉线重连并自行处理
     *
     * @param password 可以为密码原文，或密码的md5值
     */
    async login(password) {
        if (password && password.length > 0) {
            let md5pass;
            if (typeof password === "string")
                md5pass = Buffer.from(password, "hex");
            else
                md5pass = password;
            if (md5pass.length !== 16)
                md5pass = (0, common_1.md5)(String(password));
            this.password_md5 = md5pass;
        }
        try {
            const token = await fs.promises.readFile(path.join(this.dir, "token"));
            return this.tokenLogin(token);
        }
        catch {
            if (this.password_md5)
                return this.passwordLogin(this.password_md5);
            else
                return this.sig.qrsig.length ? this.qrcodeLogin() : this.fetchQrcode();
        }
    }
    /** 设置在线状态 */
    setOnlineStatus(status = this.status || common_1.OnlineStatus.Online) {
        return internal_1.setStatus.call(this, status);
    }
    /** 设置昵称 */
    async setNickname(nickname) {
        return this._setProfile(0x14E22, Buffer.from(String(nickname)));
    }
    /** 设置性别(1男2女) */
    async setGender(gender) {
        return this._setProfile(0x14E29, Buffer.from([gender]));
    }
    /** 设置生日(20201202) */
    async setBirthday(birthday) {
        const birth = String(birthday).replace(/[^\d]/g, "");
        const buf = Buffer.allocUnsafe(4);
        buf.writeUInt16BE(Number(birth.substr(0, 4)));
        buf[2] = Number(birth.substr(4, 2));
        buf[3] = Number(birth.substr(6, 2));
        return this._setProfile(0x16593, buf);
    }
    /** 设置个人说明 */
    async setDescription(description = "") {
        return this._setProfile(0x14E33, Buffer.from(String(description)));
    }
    /** 设置个性签名 */
    async setSignature(signature = "") {
        return internal_1.setSign.call(this, signature);
    }
    /** 设置头像 */
    async setAvatar(file) {
        return internal_1.setAvatar.call(this, new message_1.Image({ type: "image", file }));
    }
    /** 获取漫游表情 */
    getRoamingStamp(no_cache = false) {
        return internal_1.getStamp.call(this, no_cache);
    }
    /** 删除表情(支持批量) */
    deleteStamp(id) {
        return internal_1.delStamp.call(this, id);
    }
    /** 获取系统消息 */
    getSystemMsg() {
        return internal_1.getSysMsg.call(this);
    }
    /** 添加好友分组 */
    addClass(name) {
        return internal_1.addClass.call(this, name);
    }
    /** 删除好友分组 */
    deleteClass(id) {
        return internal_1.delClass.call(this, id);
    }
    /** 重命名好友分组 */
    renameClass(id, name) {
        return internal_1.renameClass.call(this, id, name);
    }
    /** 重载好友列表 */
    reloadFriendList() {
        return internal_1.loadFL.call(this);
    }
    /** 重载陌生人列表 */
    reloadStrangerList() {
        return internal_1.loadSL.call(this);
    }
    /** 重载群列表 */
    reloadGroupList() {
        return internal_1.loadGL.call(this);
    }
    /** 重载黑名单 */
    reloadBlackList() {
        return internal_1.loadBL.call(this);
    }
    /** 清空缓存文件 fs.rm need v14.14 */
    cleanCache() {
        const dir = path.join(this.dir, "../image");
        fs.rm?.(dir, { recursive: true }, () => {
            fs.mkdir(dir, common_1.NOOP);
        });
    }
    /** 获取视频下载地址 */
    getVideoUrl(fid, md5) {
        return this.pickFriend(this.uin).getVideoUrl(fid, md5);
    }
    /** 获取转发消息 */
    getForwardMsg(resid, fileName) {
        return this.pickFriend(this.uin).getForwardMsg(resid, fileName);
    }
    /** 制作转发消息 */
    makeForwardMsg(fake, dm = false) {
        return (dm ? this.pickFriend : this.pickGroup)(this.uin).makeForwardMsg(fake);
    }
    /** Ocr图片转文字 */
    imageOcr(file) {
        return internal_1.imageOcr.call(this, new message_1.Image({ type: "image", file }));
    }
    /** @cqhttp (cqhttp遗留方法) use client.cookies[domain] */
    getCookies(domain = "") {
        return this.cookies[domain];
    }
    /** @cqhttp use client.bkn */
    getCsrfToken() {
        return this.bkn;
    }
    /** @cqhttp use client.fl */
    getFriendList() {
        return this.fl;
    }
    /** @cqhttp use client.gl */
    getGroupList() {
        return this.gl;
    }
    /** @cqhttp use client.sl */
    getStrangerList() {
        return this.sl;
    }
    /** @cqhttp use user.getSimpleInfo() */
    async getStrangerInfo(user_id) {
        return this.pickUser(user_id).getSimpleInfo();
    }
    /** @cqhttp use group.info or group.renew() */
    async getGroupInfo(group_id, no_cache = false) {
        const group = this.pickGroup(group_id);
        if (no_cache)
            return group.renew();
        return group.info || group.renew();
    }
    /** @cqhttp use group.getMemberList() */
    async getGroupMemberList(group_id, no_cache = false) {
        return this.pickGroup(group_id).getMemberMap(no_cache);
    }
    /** @cqhttp use member.info or member.renew() */
    async getGroupMemberInfo(group_id, user_id, no_cache = false) {
        if (no_cache || !this.gml.get(group_id)?.has(user_id))
            return this.pickMember(group_id, user_id).renew();
        return this.gml.get(group_id)?.get(user_id);
    }
    /** @cqhttp use friend.sendMsg() */
    async sendPrivateMsg(user_id, message, source) {
        return this.pickFriend(user_id).sendMsg(message, source);
    }
    /** @cqhttp use group.sendMsg() */
    async sendGroupMsg(group_id, message, source) {
        return this.pickGroup(group_id).sendMsg(message, source);
    }
    /** @cqhttp use discuss.sendMsg() */
    async sendDiscussMsg(discuss_id, message, source) {
        return this.pickDiscuss(discuss_id).sendMsg(message);
    }
    /** @cqhttp use member.sendMsg() */
    async sendTempMsg(group_id, user_id, message) {
        return this.pickMember(group_id, user_id).sendMsg(message);
    }
    /** @cqhttp use user.recallMsg() or group.recallMsg() */
    async deleteMsg(message_id) {
        if (message_id.length > 24) {
            const { group_id, seq, rand, pktnum } = (0, message_1.parseGroupMessageId)(message_id);
            return this.pickGroup(group_id).recallMsg(seq, rand, pktnum);
        }
        else {
            const { user_id, seq, rand, time } = (0, message_1.parseDmMessageId)(message_id);
            return this.pickUser(user_id).recallMsg(seq, rand, time);
        }
    }
    /** @cqhttp use user.markRead() or group.markRead() */
    async reportReaded(message_id) {
        if (message_id.length > 24) {
            const { group_id, seq } = (0, message_1.parseGroupMessageId)(message_id);
            return this.pickGroup(group_id).markRead(seq);
        }
        else {
            const { user_id, time } = (0, message_1.parseDmMessageId)(message_id);
            return this.pickUser(user_id).markRead(time);
        }
    }
    /** @cqhttp use user.getChatHistory() or group.getChatHistory() */
    async getMsg(message_id) {
        return (await this.getChatHistory(message_id, 1)).pop();
    }
    /** @cqhttp use user.getChatHistory() or group.getChatHistory() */
    async getChatHistory(message_id, count = 20) {
        if (message_id.length > 24) {
            const { group_id, seq } = (0, message_1.parseGroupMessageId)(message_id);
            return this.pickGroup(group_id).getChatHistory(seq, count);
        }
        else {
            const { user_id, time } = (0, message_1.parseDmMessageId)(message_id);
            return this.pickUser(user_id).getChatHistory(time, count);
        }
    }
    /** @cqhttp use group.muteAnony() */
    async setGroupAnonymousBan(group_id, flag, duration = 1800) {
        return this.pickGroup(group_id).muteAnony(flag, duration);
    }
    /** @cqhttp use group.allowAnony() */
    async setGroupAnonymous(group_id, enable = true) {
        return this.pickGroup(group_id).allowAnony(enable);
    }
    /** @cqhttp use group.muteAll() */
    async setGroupWholeBan(group_id, enable = true) {
        return this.pickGroup(group_id).muteAll(enable);
    }
    /** @cqhttp use group.setName() */
    async setGroupName(group_id, name) {
        return this.pickGroup(group_id).setName(name);
    }
    /** @cqhttp use group.announce() */
    async sendGroupNotice(group_id, content) {
        return this.pickGroup(group_id).announce(content);
    }
    /** @cqhttp use group.setAdmin() or member.setAdmin() */
    async setGroupAdmin(group_id, user_id, enable = true) {
        return this.pickMember(group_id, user_id).setAdmin(enable);
    }
    /** @cqhttp use group.setSpecialTitle() or member.setSpecialTitle() */
    async setGroupSpecialTitle(group_id, user_id, special_title, duration = -1) {
        return this.pickMember(group_id, user_id).setTitle(special_title, duration);
    }
    /** @cqhttp use group.setCard() or member.setCard() */
    async setGroupCard(group_id, user_id, card) {
        return this.pickMember(group_id, user_id).setCard(card);
    }
    /** @cqhttp use group.kickMember() or member.kick() */
    async setGroupKick(group_id, user_id, reject_add_request = false) {
        return this.pickMember(group_id, user_id).kick(reject_add_request);
    }
    /** @cqhttp use group.muteMember() or member.mute() */
    async setGroupBan(group_id, user_id, duration = 1800) {
        return this.pickMember(group_id, user_id).mute(duration);
    }
    /** @cqhttp use group.quit() */
    async setGroupLeave(group_id) {
        return this.pickGroup(group_id).quit();
    }
    /** @cqhttp use group.pokeMember() or member.poke() */
    async sendGroupPoke(group_id, user_id) {
        return this.pickMember(group_id, user_id).poke();
    }
    /** @cqhttp use member.addFriend() */
    async addFriend(group_id, user_id, comment = "") {
        return this.pickMember(group_id, user_id).addFriend(comment);
    }
    /** @cqhttp use friend.delete() */
    async deleteFriend(user_id, block = true) {
        return this.pickFriend(user_id).delete(block);
    }
    /** @cqhttp use group.invite() */
    async inviteFriend(group_id, user_id) {
        return this.pickGroup(group_id).invite(user_id);
    }
    /** @cqhttp use friend.thumbUp() */
    async sendLike(user_id, times = 1) {
        return this.pickFriend(user_id).thumbUp(times);
    }
    /** @cqhttp user client.setAvatar() */
    async setPortrait(file) {
        return this.setAvatar(file);
    }
    /** @cqhttp use group.setAvatar() */
    async setGroupPortrait(group_id, file) {
        return this.pickGroup(group_id).setAvatar(file);
    }
    /** @cqhttp use group.fs */
    acquireGfs(group_id) {
        return this.pickGroup(group_id).fs;
    }
    /** @cqhttp use user.setFriendReq() or user.addFriendBack() */
    async setFriendAddRequest(flag, approve = true, remark = "", block = false) {
        const { user_id, seq, single } = (0, internal_1.parseFriendRequestFlag)(flag);
        const user = this.pickUser(user_id);
        return single ? user.addFriendBack(seq, remark) : user.setFriendReq(seq, approve, remark, block);
    }
    /** @cqhttp use user.setGroupInvite() or user.setGroupReq() */
    async setGroupAddRequest(flag, approve = true, reason = "", block = false) {
        const { group_id, user_id, seq, invite } = (0, internal_1.parseGroupRequestFlag)(flag);
        const user = this.pickUser(user_id);
        return invite ? user.setGroupInvite(group_id, seq, approve, block) : user.setGroupReq(group_id, seq, approve, reason, block);
    }
    /** dont use it if not clear the usage */
    sendOidb(cmd, body, timeout = 5) {
        const sp = cmd //OidbSvc.0x568_22
            .replace("OidbSvc.", "")
            .replace("oidb_", "")
            .split("_");
        const type1 = parseInt(sp[0], 16), type2 = parseInt(sp[1]);
        body = core_1.pb.encode({
            1: type1,
            2: isNaN(type2) ? 1 : type2,
            3: 0,
            4: body,
            6: "android " + this.apk.ver,
        });
        return this.sendUni(cmd, body, timeout);
    }
    /** emit an event */
    em(name = "", data) {
        data = Object.defineProperty(data || {}, "self_id", {
            value: this.uin,
            writable: true,
            enumerable: true,
            configurable: true,
        });
        while (true) {
            this.emit(name, data);
            let i = name.lastIndexOf(".");
            if (i === -1)
                break;
            name = name.slice(0, i);
        }
    }
    _msgExists(from, type, seq, time) {
        if ((0, common_1.timestamp)() + this.sig.time_diff - time >= 60 || time < this.stat.start_time)
            return true;
        const id = [from, type, seq].join("-");
        const set = this._cache.get(time);
        if (!set) {
            this._cache.set(time, new Set([id]));
            return false;
        }
        else {
            if (set.has(id))
                return true;
            else
                set.add(id);
            return false;
        }
    }
    _calcMsgCntPerMin() {
        let cnt = 0;
        for (let [time, set] of this._cache) {
            if ((0, common_1.timestamp)() - time >= 60)
                this._cache.delete(time);
            else
                cnt += set.size;
        }
        return cnt;
    }
    async _setProfile(k, v) {
        const buf = Buffer.allocUnsafe(11 + v.length);
        buf.writeUInt32BE(this.uin);
        buf.writeUInt8(0, 4);
        buf.writeInt32BE(k, 5);
        buf.writeUInt16BE(v.length, 9);
        buf.fill(v, 11);
        const payload = await this.sendOidb("OidbSvc.0x4ff_9", buf);
        const obj = core_1.pb.decode(payload);
        return obj[3] === 0 || obj[3] === 34;
    }
    /** @deprecated use client.submitSlider() */
    sliderLogin(ticket) {
        return this.submitSlider(ticket);
    }
    /** @deprecated use client.sendSmsCode() */
    sendSMSCode() {
        return this.sendSmsCode();
    }
    /** @deprecated use client.submitSmsCode() */
    submitSMSCode(code) {
        return this.submitSmsCode(code);
    }
    /** @deprecated use client.status */
    get online_status() {
        return this.status;
    }
}
exports.Client = Client;
function createDataDir(dir, uin) {
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { mode: 0o755, recursive: true });
    const img_path = path.join(dir, "image");
    const uin_path = path.join(dir, String(uin));
    if (!fs.existsSync(img_path))
        fs.mkdirSync(img_path);
    if (!fs.existsSync(uin_path))
        fs.mkdirSync(uin_path, { mode: 0o755 });
    return uin_path;
}
/** 创建一个客户端 (=new Client) */
function createClient(uin, config) {
    if (isNaN(Number(uin)))
        throw new Error(uin + " is not an OICQ account");
    return new Client(Number(uin), config);
}
exports.createClient = createClient;
