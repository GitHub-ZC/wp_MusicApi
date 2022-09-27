/// <reference types="node" />
import { pb } from "./core";
import { Gender } from "./common";
import { Sendable, PrivateMessage, MusicPlatform, Quotable, FileElem } from "./message";
import { Contactable } from "./internal";
import { MessageRet } from "./events";
import { FriendInfo } from "./entities";
declare type Client = import("./client").Client;
export interface User {
    /** 撤回消息 */
    recallMsg(msg: PrivateMessage): Promise<boolean>;
    recallMsg(msgid: string): Promise<boolean>;
    recallMsg(seq: number, rand: number, time: number): Promise<boolean>;
}
export declare class User extends Contactable {
    readonly uid: number;
    /** `this.uid`的别名 */
    get user_id(): number;
    static as(this: Client, uid: number): User;
    protected constructor(c: Client, uid: number);
    /** 返回作为好友的实例 */
    asFriend(strict?: boolean): Friend;
    /** 返回作为某群群员的实例 */
    asMember(gid: number, strict?: boolean): import("./member").Member;
    /** 获取头像url */
    getAvatarUrl(size?: 0 | 40 | 100 | 140): string;
    getAddFriendSetting(): Promise<number>;
    /** 查看资料 */
    getSimpleInfo(): Promise<{
        user_id: number;
        nickname: string;
        sex: Gender;
        age: number;
        area: string;
    }>;
    /** 获取`time`往前的`cnt`条聊天记录，默认当前时间，`cnt`默认20不能超过20 */
    getChatHistory(time?: number, cnt?: number): Promise<PrivateMessage[]>;
    /** 标记`time`之前为已读，默认当前时间 */
    markRead(time?: number): Promise<void>;
    private _getRouting;
    /**
     * 发送一条消息
     * @param source 引用回复的消息
     */
    sendMsg(content: Sendable, source?: Quotable): Promise<MessageRet>;
    protected _sendMsg(proto3: pb.Encodable, brief: string, file?: boolean): Promise<{
        message_id: string;
        seq: number;
        rand: number;
        time: any;
    }>;
    /** 回添双向好友 */
    addFriendBack(seq: number, remark?: string): Promise<boolean>;
    /** 同意好友申请 */
    setFriendReq(seq: number, yes?: boolean, remark?: string, block?: boolean): Promise<boolean>;
    /** 同意入群申请 */
    setGroupReq(gid: number, seq: number, yes?: boolean, reason?: string, block?: boolean): Promise<boolean>;
    /** 同意群邀请 */
    setGroupInvite(gid: number, seq: number, yes?: boolean, block?: boolean): Promise<boolean>;
    getFileInfo(fid: string): Promise<Omit<FileElem, "type"> & Record<"url", string>>;
    /** 获取离线文件下载地址 */
    getFileUrl(fid: string): Promise<string>;
}
/** 好友(继承User) */
export declare class Friend extends User {
    private _info?;
    static as(this: Client, uid: number, strict?: boolean): Friend;
    /** 好友资料 */
    get info(): FriendInfo | undefined;
    get nickname(): string | undefined;
    get sex(): Gender | undefined;
    get remark(): string | undefined;
    get class_id(): number | undefined;
    get class_name(): string | undefined;
    protected constructor(c: Client, uid: number, _info?: FriendInfo | undefined);
    /** 发送音乐分享 */
    shareMusic(platform: MusicPlatform, id: string): Promise<void>;
    /** 设置备注 */
    setRemark(remark: string): Promise<void>;
    /** 设置分组(注意：如果分组id不存在也会成功) */
    setClass(id: number): Promise<void>;
    /** 点赞，默认一次 */
    thumbUp(times?: number): Promise<boolean>;
    /** 戳一戳 */
    poke(self?: boolean): Promise<boolean>;
    /** 删除好友，`block`默认为`true` */
    delete(block?: boolean): Promise<boolean>;
    /**
     * 发送离线文件
     * @param file 一个文件路径，或者一块Buffer
     * @param filename 对方看到的文件名(file为Buffer时，若留空则自动以md5命名)
     * @param callback 监控上传进度的回调函数，拥有一个"百分比进度"的参数
     * @returns 文件id(撤回时使用)
     */
    sendFile(file: string | Buffer | Uint8Array, filename?: string, callback?: (percentage: string) => void): Promise<string>;
    /** 撤回离线文件 */
    recallFile(fid: string): Promise<boolean>;
    /** 转发离线文件 */
    forwardFile(fid: string): Promise<string>;
}
export {};
