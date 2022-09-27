import { Contactable } from "./internal";
import { Sendable, GroupMessage, ImageElem, MusicPlatform, Anonymous, Quotable } from "./message";
import { Gfs } from "./gfs";
import { MessageRet } from "./events";
import { GroupInfo, MemberInfo } from "./entities";
declare type Client = import("./client").Client;
/** 讨论组 */
export declare class Discuss extends Contactable {
    readonly gid: number;
    static as(this: Client, gid: number): Discuss;
    /** `this.gid`的别名 */
    get group_id(): number;
    protected constructor(c: Client, gid: number);
    /** 发送一条消息 */
    sendMsg(content: Sendable): Promise<MessageRet>;
}
/** 群 */
export interface Group {
    /** 撤回消息 */
    recallMsg(msg: GroupMessage): Promise<boolean>;
    recallMsg(msgid: string): Promise<boolean>;
    recallMsg(seq: number, rand: number, pktnum?: number): Promise<boolean>;
}
/** 群 */
export declare class Group extends Discuss {
    private _info?;
    static as(this: Client, gid: number, strict?: boolean): Group;
    /** 群资料 */
    get info(): GroupInfo | undefined;
    get name(): string | undefined;
    /** 我是否是群主 */
    get is_owner(): boolean;
    /** 我是否是管理 */
    get is_admin(): boolean;
    /** 是否全员禁言 */
    get all_muted(): boolean;
    /** 我的禁言剩余时间 */
    get mute_left(): number;
    /** 群文件系统 */
    readonly fs: Gfs;
    protected constructor(c: Client, gid: number, _info?: GroupInfo | undefined);
    /** 获取一枚群员实例 */
    pickMember(uid: number, strict?: boolean): import("./member").Member;
    /** 获取群头像url (history=1,2,3...) */
    getAvatarUrl(size?: 0 | 40 | 100 | 140, history?: number): string;
    /** 强制刷新资料 */
    renew(): Promise<GroupInfo>;
    private _fetchMembers;
    /** 获取群员列表 */
    getMemberMap(no_cache?: boolean): Promise<Map<number, MemberInfo>>;
    /** 发送音乐分享 */
    shareMusic(platform: MusicPlatform, id: string): Promise<void>;
    /**
     * 发送一条消息
     * @param source 引用回复的消息
     * @param anony 匿名
     */
    sendMsg(content: Sendable, source?: Quotable, anony?: Omit<Anonymous, "flag"> | boolean): Promise<MessageRet>;
    private _sendMsgByFrag;
    /** 设置群名 */
    setName(name: string): Promise<boolean>;
    /** 全员禁言 */
    muteAll(yes?: boolean): Promise<boolean>;
    /** 发送简易群公告 */
    announce(content: string): Promise<boolean>;
    private _setting;
    /** 允许/禁止匿名 */
    allowAnony(yes?: boolean): Promise<boolean>;
    /** 设置备注 */
    setRemark(remark?: string): Promise<void>;
    /** 禁言匿名玩家，默认1800秒 */
    muteAnony(flag: string, duration?: number): Promise<void>;
    /** 获取自己的匿名情报 */
    getAnonyInfo(): Promise<Omit<Anonymous, "flag">>;
    /** 获取 @全体成员 的剩余次数 */
    getAtAllRemainder(): Promise<number>;
    private _getLastSeq;
    /** 标记`seq`之前为已读，默认到最后一条发言 */
    markRead(seq?: number): Promise<void>;
    /** 获取`seq`之前的`cnt`条聊天记录，默认从最后一条发言往前，`cnt`默认20不能超过20 */
    getChatHistory(seq?: number, cnt?: number): Promise<GroupMessage[]>;
    /** 获取群文件下载地址 */
    getFileUrl(fid: string): Promise<string>;
    /** 设置群头像 */
    setAvatar(file: ImageElem["file"]): Promise<void>;
    /** 邀请好友入群 */
    invite(uid: number): Promise<boolean>;
    /** 退群/解散 */
    quit(): Promise<boolean>;
    setAdmin(uid: number, yes?: boolean): Promise<boolean>;
    setTitle(uid: number, title?: string, duration?: number): Promise<boolean>;
    setCard(uid: number, card?: string): Promise<boolean>;
    kickMember(uid: number, block?: boolean): Promise<boolean>;
    muteMember(uid: number, duration?: number): Promise<void>;
    pokeMember(uid: number): Promise<boolean>;
}
export {};
