/// <reference types="node" />
import * as log4js from "log4js";
import { BaseClient, Platform, Domain } from "./core";
import { Gender, OnlineStatus } from "./common";
import { OcrResult } from "./internal";
import { StrangerInfo, FriendInfo, GroupInfo, MemberInfo } from "./entities";
import { EventMap } from "./events";
import { User, Friend } from "./friend";
import { Discuss, Group } from "./group";
import { Member } from "./member";
import { Forwardable, Quotable, Sendable, ImageElem } from "./message";
/** 事件接口 */
export interface Client extends BaseClient {
    on<T extends keyof EventMap>(event: T, listener: EventMap<this>[T]): this;
    on<S extends string | symbol>(event: S & Exclude<S, keyof EventMap>, listener: (this: this, ...args: any[]) => void): this;
    once<T extends keyof EventMap>(event: T, listener: EventMap<this>[T]): this;
    once<S extends string | symbol>(event: S & Exclude<S, keyof EventMap>, listener: (this: this, ...args: any[]) => void): this;
    prependListener<T extends keyof EventMap>(event: T, listener: EventMap<this>[T]): this;
    prependListener(event: string | symbol, listener: (this: this, ...args: any[]) => void): this;
    prependOnceListener<T extends keyof EventMap>(event: T, listener: EventMap<this>[T]): this;
    prependOnceListener(event: string | symbol, listener: (this: this, ...args: any[]) => void): this;
    off<T extends keyof EventMap>(event: T, listener: EventMap<this>[T]): this;
    off<S extends string | symbol>(event: S & Exclude<S, keyof EventMap>, listener: (this: this, ...args: any[]) => void): this;
}
/** 一个客户端 */
export declare class Client extends BaseClient {
    /**
     * 得到一个群对象, 通常不会重复创建，调用
     * @param strict 严格模式，若群不存在会抛出异常
     */
    readonly pickGroup: (gid: number, strict?: boolean | undefined) => Group;
    /** 得到一个好友对象, 通常不会重复创建 */
    readonly pickFriend: (uid: number, strict?: boolean | undefined) => Friend;
    /** 得到一个群员对象, 通常不会重复创建 */
    readonly pickMember: (gid: number, uid: number, strict?: boolean | undefined) => Member;
    /** 创建一个用户对象 */
    readonly pickUser: (uid: number) => User;
    /** 创建一个讨论组对象 */
    readonly pickDiscuss: (gid: number) => Discuss;
    /** 日志记录器，初始情况下是`log4js.Logger` */
    logger: Logger | log4js.Logger;
    /** 账号本地数据存储目录 */
    readonly dir: string;
    /** 配置 */
    readonly config: Required<Config>;
    protected readonly _cache: Map<number, Set<string>>;
    protected _sync_cookie?: Uint8Array;
    /** 密码的md5值，调用login后会保存在这里，用于token过期时恢复登录 */
    password_md5?: Buffer;
    get [Symbol.toStringTag](): string;
    /** 好友列表(务必以`ReadonlyMap`方式访问) */
    readonly fl: Map<number, FriendInfo>;
    /** 陌生人列表(务必以`ReadonlyMap`方式访问) */
    readonly sl: Map<number, StrangerInfo>;
    /** 群列表(务必以`ReadonlyMap`方式访问) */
    readonly gl: Map<number, GroupInfo>;
    /** 群员列表缓存(务必以`ReadonlyMap`方式访问) */
    readonly gml: Map<number, Map<number, MemberInfo>>;
    /** 黑名单列表(务必以`ReadonlySet`方式访问) */
    readonly blacklist: Set<number>;
    /** 好友分组 */
    readonly classes: Map<number, string>;
    /** 勿手动修改这些属性 */
    status: OnlineStatus;
    nickname: string;
    sex: Gender;
    age: number;
    bid: string;
    /** 漫游表情缓存 */
    stamp: Set<string>;
    /** 相当于频道中的qq号 */
    tiny_id: string;
    /** csrf token */
    get bkn(): number;
    readonly cookies: {
        [domain in Domain]: string;
    };
    /** 数据统计 */
    get stat(): {
        start_time: number;
        lost_times: number;
        recv_pkt_cnt: number;
        sent_pkt_cnt: number;
        lost_pkt_cnt: number;
        recv_msg_cnt: number;
        sent_msg_cnt: number;
        msg_cnt_per_min: number;
        remote_ip: string;
        remote_port: number;
    };
    /** 修改日志级别 */
    set log_level(level: LogLevel);
    constructor(uin: number, conf?: Config);
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
    login(password?: string | Buffer): Promise<void>;
    /** 设置在线状态 */
    setOnlineStatus(status?: OnlineStatus): Promise<boolean>;
    /** 设置昵称 */
    setNickname(nickname: string): Promise<boolean>;
    /** 设置性别(1男2女) */
    setGender(gender: 0 | 1 | 2): Promise<boolean>;
    /** 设置生日(20201202) */
    setBirthday(birthday: string | number): Promise<boolean>;
    /** 设置个人说明 */
    setDescription(description?: string): Promise<boolean>;
    /** 设置个性签名 */
    setSignature(signature?: string): Promise<boolean>;
    /** 设置头像 */
    setAvatar(file: ImageElem["file"]): Promise<void>;
    /** 获取漫游表情 */
    getRoamingStamp(no_cache?: boolean): Promise<string[]>;
    /** 删除表情(支持批量) */
    deleteStamp(id: string | string[]): Promise<void>;
    /** 获取系统消息 */
    getSystemMsg(): Promise<(import("./events").FriendRequestEvent | import("./events").GroupRequestEvent | import("./events").GroupInviteEvent)[]>;
    /** 添加好友分组 */
    addClass(name: string): Promise<void>;
    /** 删除好友分组 */
    deleteClass(id: number): Promise<void>;
    /** 重命名好友分组 */
    renameClass(id: number, name: string): Promise<void>;
    /** 重载好友列表 */
    reloadFriendList(): Promise<void>;
    /** 重载陌生人列表 */
    reloadStrangerList(): Promise<void>;
    /** 重载群列表 */
    reloadGroupList(): Promise<void>;
    /** 重载黑名单 */
    reloadBlackList(): Promise<void>;
    /** 清空缓存文件 fs.rm need v14.14 */
    cleanCache(): void;
    /** 获取视频下载地址 */
    getVideoUrl(fid: string, md5: string | Buffer): Promise<string>;
    /** 获取转发消息 */
    getForwardMsg(resid: string, fileName?: string): Promise<import("./message").ForwardMessage[]>;
    /** 制作转发消息 */
    makeForwardMsg(fake: Forwardable[], dm?: boolean): Promise<import("./message").XmlElem>;
    /** Ocr图片转文字 */
    imageOcr(file: ImageElem["file"]): Promise<OcrResult>;
    /** @cqhttp (cqhttp遗留方法) use client.cookies[domain] */
    getCookies(domain?: Domain): string;
    /** @cqhttp use client.bkn */
    getCsrfToken(): number;
    /** @cqhttp use client.fl */
    getFriendList(): Map<number, FriendInfo>;
    /** @cqhttp use client.gl */
    getGroupList(): Map<number, GroupInfo>;
    /** @cqhttp use client.sl */
    getStrangerList(): Map<number, StrangerInfo>;
    /** @cqhttp use user.getSimpleInfo() */
    getStrangerInfo(user_id: number): Promise<{
        user_id: number;
        nickname: string;
        sex: Gender;
        age: number;
        area: string;
    }>;
    /** @cqhttp use group.info or group.renew() */
    getGroupInfo(group_id: number, no_cache?: boolean): Promise<GroupInfo>;
    /** @cqhttp use group.getMemberList() */
    getGroupMemberList(group_id: number, no_cache?: boolean): Promise<Map<number, MemberInfo>>;
    /** @cqhttp use member.info or member.renew() */
    getGroupMemberInfo(group_id: number, user_id: number, no_cache?: boolean): Promise<MemberInfo>;
    /** @cqhttp use friend.sendMsg() */
    sendPrivateMsg(user_id: number, message: Sendable, source?: Quotable): Promise<import("./events").MessageRet>;
    /** @cqhttp use group.sendMsg() */
    sendGroupMsg(group_id: number, message: Sendable, source?: Quotable): Promise<import("./events").MessageRet>;
    /** @cqhttp use discuss.sendMsg() */
    sendDiscussMsg(discuss_id: number, message: Sendable, source?: Quotable): Promise<import("./events").MessageRet>;
    /** @cqhttp use member.sendMsg() */
    sendTempMsg(group_id: number, user_id: number, message: Sendable): Promise<import("./events").MessageRet>;
    /** @cqhttp use user.recallMsg() or group.recallMsg() */
    deleteMsg(message_id: string): Promise<boolean>;
    /** @cqhttp use user.markRead() or group.markRead() */
    reportReaded(message_id: string): Promise<void>;
    /** @cqhttp use user.getChatHistory() or group.getChatHistory() */
    getMsg(message_id: string): Promise<import("./message").GroupMessage | import("./message").PrivateMessage | undefined>;
    /** @cqhttp use user.getChatHistory() or group.getChatHistory() */
    getChatHistory(message_id: string, count?: number): Promise<import("./message").PrivateMessage[] | import("./message").GroupMessage[]>;
    /** @cqhttp use group.muteAnony() */
    setGroupAnonymousBan(group_id: number, flag: string, duration?: number): Promise<void>;
    /** @cqhttp use group.allowAnony() */
    setGroupAnonymous(group_id: number, enable?: boolean): Promise<boolean>;
    /** @cqhttp use group.muteAll() */
    setGroupWholeBan(group_id: number, enable?: boolean): Promise<boolean>;
    /** @cqhttp use group.setName() */
    setGroupName(group_id: number, name: string): Promise<boolean>;
    /** @cqhttp use group.announce() */
    sendGroupNotice(group_id: number, content: string): Promise<boolean>;
    /** @cqhttp use group.setAdmin() or member.setAdmin() */
    setGroupAdmin(group_id: number, user_id: number, enable?: boolean): Promise<boolean>;
    /** @cqhttp use group.setSpecialTitle() or member.setSpecialTitle() */
    setGroupSpecialTitle(group_id: number, user_id: number, special_title: string, duration?: number): Promise<boolean>;
    /** @cqhttp use group.setCard() or member.setCard() */
    setGroupCard(group_id: number, user_id: number, card: string): Promise<boolean>;
    /** @cqhttp use group.kickMember() or member.kick() */
    setGroupKick(group_id: number, user_id: number, reject_add_request?: boolean): Promise<boolean>;
    /** @cqhttp use group.muteMember() or member.mute() */
    setGroupBan(group_id: number, user_id: number, duration?: number): Promise<void>;
    /** @cqhttp use group.quit() */
    setGroupLeave(group_id: number): Promise<boolean>;
    /** @cqhttp use group.pokeMember() or member.poke() */
    sendGroupPoke(group_id: number, user_id: number): Promise<boolean>;
    /** @cqhttp use member.addFriend() */
    addFriend(group_id: number, user_id: number, comment?: string): Promise<boolean>;
    /** @cqhttp use friend.delete() */
    deleteFriend(user_id: number, block?: boolean): Promise<boolean>;
    /** @cqhttp use group.invite() */
    inviteFriend(group_id: number, user_id: number): Promise<boolean>;
    /** @cqhttp use friend.thumbUp() */
    sendLike(user_id: number, times?: number): Promise<boolean>;
    /** @cqhttp user client.setAvatar() */
    setPortrait(file: Parameters<Client["setAvatar"]>[0]): Promise<void>;
    /** @cqhttp use group.setAvatar() */
    setGroupPortrait(group_id: number, file: Parameters<Group["setAvatar"]>[0]): Promise<void>;
    /** @cqhttp use group.fs */
    acquireGfs(group_id: number): import("./gfs").Gfs;
    /** @cqhttp use user.setFriendReq() or user.addFriendBack() */
    setFriendAddRequest(flag: string, approve?: boolean, remark?: string, block?: boolean): Promise<boolean>;
    /** @cqhttp use user.setGroupInvite() or user.setGroupReq() */
    setGroupAddRequest(flag: string, approve?: boolean, reason?: string, block?: boolean): Promise<boolean>;
    /** dont use it if not clear the usage */
    sendOidb(cmd: string, body: Uint8Array, timeout?: number): Promise<Buffer>;
    /** emit an event */
    em(name?: string, data?: any): void;
    protected _msgExists(from: number, type: number, seq: number, time: number): boolean;
    protected _calcMsgCntPerMin(): number;
    private _setProfile;
    /** @deprecated use client.submitSlider() */
    sliderLogin(ticket: string): void;
    /** @deprecated use client.sendSmsCode() */
    sendSMSCode(): void;
    /** @deprecated use client.submitSmsCode() */
    submitSMSCode(code: string): void;
    /** @deprecated use client.status */
    get online_status(): OnlineStatus;
}
/** 日志记录器接口 */
export interface Logger {
    trace(msg: any, ...args: any[]): any;
    debug(msg: any, ...args: any[]): any;
    info(msg: any, ...args: any[]): any;
    warn(msg: any, ...args: any[]): any;
    error(msg: any, ...args: any[]): any;
    fatal(msg: any, ...args: any[]): any;
    mark(msg: any, ...args: any[]): any;
}
/** 日志等级 */
export declare type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal" | "mark" | "off";
/** 配置项 */
export interface Config {
    /** 日志等级，默认info (打印日志会降低性能，若消息量巨大建议修改此参数) */
    log_level?: LogLevel;
    /** 1:安卓手机(默认) 2:aPad 3:安卓手表 4:MacOS 5:iPad */
    platform?: Platform;
    /** 群聊和频道中过滤自己的消息(默认true) */
    ignore_self?: boolean;
    /** 被风控时是否尝试用分片发送，默认true */
    resend?: boolean;
    /** 数据存储文件夹，需要可写权限，默认主模块下的data文件夹 */
    data_dir?: string;
    /**
     * 触发system.offline.network事件后的重新登录间隔秒数，默认5(秒)，不建议设置过低
     * 设置为0则不会自动重连，然后你可以监听此事件自己处理
     */
    reconn_interval?: number;
    /** 是否缓存群员列表(默认true)，群多的时候(500~1000)会多占据约100MB+内存，关闭后进程只需不到20MB内存 */
    cache_group_member?: boolean;
    /** 自动选择最优服务器(默认true)，关闭后会一直使用`msfwifi.3g.qq.com:8080`进行连接 */
    auto_server?: boolean;
    /** ffmpeg */
    ffmpeg_path?: string;
    ffprobe_path?: string;
}
/** 数据统计 */
export declare type Statistics = Client["stat"];
/** 创建一个客户端 (=new Client) */
export declare function createClient(uin: number, config?: Config): Client;
