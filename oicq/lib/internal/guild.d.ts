/// <reference types="node" />
import { pb } from "../core";
import { MessageElem, Sendable } from "../message";
declare type Client = import("../client").Client;
export declare class GuildMessageEvent {
    /** 频道id */
    guild_id: string;
    guild_name: string;
    /** 子频道id */
    channel_id: string;
    channel_name: string;
    /** 消息序号(同一子频道中一般顺序递增) */
    seq: number;
    rand: number;
    time: number;
    message: MessageElem[];
    raw_message: string;
    sender: {
        tiny_id: string;
        nickname: string;
    };
    constructor(proto: pb.Proto);
    /** 暂时仅支持发送： 文本、AT、表情 */
    reply: (content: Sendable) => void;
}
export declare function guildMsgListener(this: Client, payload: Buffer): void;
export {};
