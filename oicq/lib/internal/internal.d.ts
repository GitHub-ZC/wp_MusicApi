import { pb } from "../core";
import { OnlineStatus } from "../common";
import { Image } from "../message";
declare type Client = import("../client").Client;
export declare function setStatus(this: Client, status: OnlineStatus): Promise<boolean>;
export declare function setSign(this: Client, sign: string): Promise<boolean>;
export declare function setAvatar(this: Client, img: Image): Promise<void>;
export declare function getStamp(this: Client, no_cache?: boolean): Promise<string[]>;
export declare function delStamp(this: Client, id: string | string[]): Promise<void>;
export declare function addClass(this: Client, name: string): Promise<void>;
export declare function delClass(this: Client, id: number): Promise<void>;
export declare function renameClass(this: Client, id: number, name: string): Promise<void>;
export declare function loadFL(this: Client): Promise<void>;
export declare function loadSL(this: Client): Promise<void>;
export declare function loadGL(this: Client): Promise<void>;
export declare function loadBL(this: Client): Promise<void>;
export declare class OcrResult {
    language: string;
    wordslist: Array<{
        words: string;
        confidence: number;
        polygon: Array<{
            x: number;
            y: number;
        }>;
    }>;
    constructor(proto: pb.Proto);
    toString(): string;
}
export declare function imageOcr(this: Client, img: Image): Promise<OcrResult>;
export {};
