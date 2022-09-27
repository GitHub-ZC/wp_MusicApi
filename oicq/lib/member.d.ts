import { MemberInfo } from "./entities";
import { User } from "./friend";
declare type Client = import("./client").Client;
/** @ts-ignore ts(2417) 群员(继承User) */
export declare class Member extends User {
    readonly gid: number;
    private _info?;
    static as(this: Client, gid: number, uid: number, strict?: boolean): Member;
    /** 群员资料 */
    get info(): MemberInfo | undefined;
    /** `this.gid`的别名 */
    get group_id(): number;
    get card(): string | undefined;
    get title(): string | undefined;
    get is_friend(): boolean;
    get is_owner(): boolean;
    get is_admin(): boolean;
    /** 禁言剩余时间 */
    get mute_left(): number;
    /** 返回所在群的实例 */
    get group(): import("./group").Group;
    protected constructor(c: Client, gid: number, uid: number, _info?: MemberInfo | undefined);
    /** 强制刷新资料 */
    renew(): Promise<MemberInfo>;
    /** 设置/取消管理员 */
    setAdmin(yes?: boolean): Promise<boolean>;
    /** 设置头衔 */
    setTitle(title?: string, duration?: number): Promise<boolean>;
    /** 修改名片 */
    setCard(card?: string): Promise<boolean>;
    /** 踢 */
    kick(block?: boolean): Promise<boolean>;
    /** 禁言，默认1800秒 */
    mute(duration?: number): Promise<void>;
    /** 戳一戳 */
    poke(): Promise<boolean>;
    /** 加为好友 */
    addFriend(comment?: string): Promise<boolean>;
}
export {};
