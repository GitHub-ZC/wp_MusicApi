/// <reference types="node" />
import { EventEmitter } from "events";
import { ShortDevice, Device, Platform, Apk } from "./device";
declare const FN_NEXT_SEQ: unique symbol;
declare const FN_SEND: unique symbol;
declare const FN_SEND_LOGIN: unique symbol;
declare const HANDLERS: unique symbol;
declare const NET: unique symbol;
declare const ECDH: unique symbol;
declare const IS_ONLINE: unique symbol;
declare const LOGIN_LOCK: unique symbol;
declare const HEARTBEAT: unique symbol;
export declare enum VerboseLevel {
    Fatal = 0,
    Mark = 1,
    Error = 2,
    Warn = 3,
    Info = 4,
    Debug = 5
}
export declare class ApiRejection {
    code: number;
    message: string;
    constructor(code: number, message?: string);
}
export declare enum QrcodeResult {
    OtherError = 0,
    Timeout = 17,
    WaitingForScan = 48,
    WaitingForConfirm = 53,
    Canceled = 54
}
export interface BaseClient {
    /** 收到二维码 */
    on(name: "internal.qrcode", listener: (this: this, qrcode: Buffer) => void): this;
    /** 收到滑动验证码 */
    on(name: "internal.slider", listener: (this: this, url: string) => void): this;
    /** 登录保护验证 */
    on(name: "internal.verify", listener: (this: this, url: string, phone: string) => void): this;
    /** token过期(此时已掉线) */
    on(name: "internal.error.token", listener: (this: this) => void): this;
    /** 网络错误 */
    on(name: "internal.error.network", listener: (this: this, code: number, message: string) => void): this;
    /** 密码登录相关错误 */
    on(name: "internal.error.login", listener: (this: this, code: number, message: string) => void): this;
    /** 扫码登录相关错误 */
    on(name: "internal.error.qrcode", listener: (this: this, code: QrcodeResult, message: string) => void): this;
    /** 登录成功 */
    on(name: "internal.online", listener: (this: this, token: Buffer, nickname: string, gender: number, age: number) => void): this;
    /** token更新 */
    on(name: "internal.token", listener: (this: this, token: Buffer) => void): this;
    /** 服务器强制下线 */
    on(name: "internal.kickoff", listener: (this: this, reason: string) => void): this;
    /** 业务包 */
    on(name: "internal.sso", listener: (this: this, cmd: string, payload: Buffer, seq: number) => void): this;
    /** 日志信息 */
    on(name: "internal.verbose", listener: (this: this, verbose: unknown, level: VerboseLevel) => void): this;
    on(name: string | symbol, listener: (this: this, ...args: any[]) => void): this;
}
export declare class BaseClient extends EventEmitter {
    readonly uin: number;
    private [IS_ONLINE];
    private [LOGIN_LOCK];
    private [ECDH];
    private readonly [NET];
    private readonly [HANDLERS];
    readonly apk: Apk;
    readonly device: Device;
    readonly sig: {
        seq: number;
        session: Buffer;
        randkey: Buffer;
        tgtgt: Buffer;
        tgt: Buffer;
        skey: Buffer;
        d2: Buffer;
        d2key: Buffer;
        t104: Buffer;
        t174: Buffer;
        qrsig: Buffer;
        /** 大数据上传通道 */
        bigdata: {
            ip: string;
            port: number;
            sig_session: Buffer;
            session_key: Buffer;
        };
        /** 心跳包 */
        hb480: Uint8Array;
        /** 上次cookie刷新时间 */
        emp_time: number;
        time_diff: number;
    };
    readonly pskey: {
        [domain: string]: Buffer;
    };
    /** 心跳间隔(秒) */
    protected interval: number;
    /** 随心跳一起触发的函数，可以随意设定 */
    protected heartbeat: () => void;
    private [HEARTBEAT];
    /** 数据统计 */
    protected readonly statistics: {
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
    constructor(uin: number, p?: Platform, d?: ShortDevice);
    /** 设置连接服务器，不设置则自动搜索 */
    setRemoteServer(host?: string, port?: number): void;
    /** 是否为在线状态 (可以收发业务包的状态) */
    isOnline(): boolean;
    /** 下线 (keepalive: 是否保持tcp连接) */
    logout(keepalive?: boolean): Promise<void>;
    /** 关闭连接 */
    terminate(): void;
    /** 使用接收到的token登录 */
    tokenLogin(token: Buffer): void;
    /**
     * 使用密码登录
     * @param md5pass 密码的md5值
     */
    passwordLogin(md5pass: Buffer): void;
    /** 收到滑动验证码后，用于提交滑动验证码 */
    submitSlider(ticket: string): void;
    /** 收到设备锁验证请求后，用于发短信 */
    sendSmsCode(): void;
    /** 提交短信验证码 */
    submitSmsCode(code: string): void;
    /** 获取登录二维码(模拟手表协议扫码登录) */
    fetchQrcode(): void;
    /** 扫码后调用此方法登录 */
    qrcodeLogin(): Promise<void>;
    /** 获取扫码结果(可定时查询，retcode为0则调用qrcodeLogin登录) */
    queryQrcodeResult(): Promise<{
        retcode: number;
        uin: number | undefined;
        t106: Buffer | undefined;
        t16a: Buffer | undefined;
        t318: Buffer | undefined;
        tgtgt: Buffer | undefined;
    }>;
    private [FN_NEXT_SEQ];
    private [FN_SEND];
    private [FN_SEND_LOGIN];
    /** 发送一个业务包不等待返回 */
    writeUni(cmd: string, body: Uint8Array, seq?: number): void;
    /** 发送一个业务包并等待返回 */
    sendUni(cmd: string, body: Uint8Array, timeout?: number): Promise<Buffer>;
}
export {};
