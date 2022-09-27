/// <reference types="node" />
import { pb } from "../core";
import { GroupRole, Gender } from "../common";
import { Parser } from "./parser";
import { Quotable, Forwardable, MessageElem } from "./elements";
/** 匿名情报 */
export interface Anonymous {
    /** 是否可以匿名发言 */
    enable: boolean;
    flag: string;
    id: number;
    id2: number;
    name: string;
    expire_time: number;
    color: string;
}
export declare function rand2uuid(rand: number): bigint;
export declare function uuid2rand(uuid: bigint): number;
/** @cqhttp 生成私聊消息id */
export declare function genDmMessageId(uid: number, seq: number, rand: number, time: number, flag?: number): string;
/** @cqhttp 解析私聊消息id */
export declare function parseDmMessageId(msgid: string): {
    user_id: number;
    seq: number;
    rand: number;
    time: number;
    flag: number;
};
/** @cqhttp 生成群消息id */
export declare function genGroupMessageId(gid: number, uid: number, seq: number, rand: number, time: number, pktnum?: number): string;
/** @cqhttp 解析群消息id */
export declare function parseGroupMessageId(msgid: string): {
    group_id: number;
    user_id: number;
    seq: number;
    rand: number;
    time: number;
    pktnum: number;
};
/** 一条消息 */
export declare abstract class Message implements Quotable, Forwardable {
    protected proto: pb.Proto;
    protected readonly parsed: Parser;
    /**
     * 该值永远指向消息发送者。
     * 对于私聊消息，请使用`from_id`和`to_id`来确定发送者和接收者。
     * 建议使用 `sender.user_id`
     * @deprecated 未来会改为访问器，仅供内部转发消息时使用。
     */
    user_id: number;
    /** 仅供内部转发消息时使用 */
    get nickname(): string;
    post_type: "message";
    /** 消息时间 */
    time: number;
    /** 消息元素数组 */
    message: MessageElem[];
    /** 字符串形式的消息 */
    raw_message: string;
    font: string;
    /** @cqhttp cqhttp方法用 */
    message_id: string;
    /** 消息编号，在群消息中是唯一的 (私聊消息建议至少使用time,seq,rand中的两个判断唯一性) */
    seq: number;
    /** 消息随机数 */
    rand: number;
    sender?: {
        [k: string]: any;
    };
    /** 引用回复 */
    source?: Quotable;
    pktnum: number;
    index: number;
    div: number;
    /** 反序列化一条消息 (私聊消息需要你的uin) */
    static deserialize(serialized: Buffer, uin?: number): GroupMessage | DiscussMessage | PrivateMessage;
    /** 组合分片消息(通常仅内部使用) */
    static combine(msgs: Message[]): Message;
    constructor(proto: pb.Proto);
    /** 将消息序列化保存 */
    serialize(): Buffer;
    /** 以适合人类阅读的形式输出 */
    toString(): string;
    /** @deprecated 转换为CQ码 */
    toCqcode(): string;
}
/** 一条私聊消息 */
export declare class PrivateMessage extends Message {
    message_type: "private";
    /** friend:好友 group:群临时会话 self:我的设备 other:其他途径的临时会话 */
    sub_type: "group" | "friend" | "other" | "self";
    from_id: number;
    to_id: number;
    auto_reply: boolean;
    sender: {
        user_id: number;
        nickname: string;
        group_id: number | undefined;
        discuss_id: number | undefined;
    };
    /** 反序列化一条私聊消息，你需要传入你的`uin`，否则无法知道你是发送者还是接收者 */
    static deserialize(serialized: Buffer, uin?: number): PrivateMessage;
    constructor(proto: pb.Proto, uin?: number);
}
/** 一条群消息 */
export declare class GroupMessage extends Message {
    message_type: "group";
    /** anonymous:匿名 normal:通常  */
    sub_type: "normal" | "anonymous";
    group_id: number;
    group_name: string;
    anonymous: Anonymous | null;
    block: boolean;
    atme: boolean;
    atall: boolean;
    sender: {
        user_id: number;
        nickname: string;
        card: string;
        /** @deprecated */
        sex: Gender;
        /** @deprecated */
        age: number;
        /** @deprecated */
        area: string;
        level: number;
        role: GroupRole;
        title: string;
    };
    /** 反序列化一条群消息 */
    static deserialize(serialized: Buffer): GroupMessage;
    constructor(proto: pb.Proto);
}
/** 一条讨论组消息 */
export declare class DiscussMessage extends Message {
    message_type: "discuss";
    discuss_id: number;
    discuss_name: string;
    atme: boolean;
    sender: {
        user_id: number;
        nickname: string;
        card: string;
    };
    /** 反序列化一条讨论组消息 */
    static deserialize(serialized: Buffer): DiscussMessage;
    constructor(proto: pb.Proto);
}
/** 一条转发消息 */
export declare class ForwardMessage implements Forwardable {
    protected proto: pb.Proto;
    private parsed;
    user_id: number;
    nickname: string;
    group_id?: number;
    time: number;
    message: MessageElem[];
    raw_message: string;
    /** 反序列化一条转发消息 */
    static deserialize(serialized: Buffer): ForwardMessage;
    constructor(proto: pb.Proto);
    /** 将转发消息序列化保存 */
    serialize(): Buffer;
    /** 以适合人类阅读的形式输出 */
    toString(): string;
    /** @deprecated 转换为CQ码 */
    toCqcode(): string;
}
