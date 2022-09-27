/// <reference types="node" />
import { FileElem } from "./message";
declare type Client = import("./client").Client;
/** (群文件/目录)共通属性 */
export interface GfsBaseStat {
    /** 文件或目录的id (目录以/开头) */
    fid: string;
    /** 父目录id */
    pid: string;
    name: string;
    user_id: number;
    create_time: number;
    is_dir: boolean;
}
/** 文件属性 */
export interface GfsFileStat extends GfsBaseStat {
    size: number;
    busid: number;
    md5: string;
    sha1: string;
    duration: number;
    download_times: number;
}
/** 目录属性 */
export interface GfsDirStat extends GfsBaseStat {
    file_count: number;
}
/**
 * 群文件系统
 * fid表示一个文件或目录的id，pid表示它所在目录的id
 * 根目录的id为"/"
 * 只能在根目录下创建目录
 * 删除一个目录会删除下面的全部文本
 */
export declare class Gfs {
    private readonly c;
    readonly gid: number;
    /** `this.gid`的别名 */
    get group_id(): number;
    /** 返回所在群的实例 */
    get group(): import("./group").Group;
    /** 返回所属的客户端对象 */
    get client(): import("./client").Client;
    constructor(c: Client, gid: number);
    /** 获取使用空间和文件数 */
    df(): Promise<{
        total: number;
        used: number;
        free: number;
    } & {
        file_count: number;
        max_file_count: number;
    }>;
    private _resolve;
    /** 获取文件或目录属性 */
    stat(fid: string): Promise<GfsFileStat | GfsDirStat>;
    /** 列出目录下的所有文件和目录(默认pid为根目录`/`) */
    dir(pid?: string, start?: number, limit?: number): Promise<(GfsFileStat | GfsDirStat)[]>;
    /** `this.dir`的别名 */
    ls(pid?: string, start?: number, limit?: number): Promise<(GfsFileStat | GfsDirStat)[]>;
    /** 创建目录(只能在根目录下创建) */
    mkdir(name: string): Promise<GfsDirStat>;
    /** 删除文件或目录(删除目录会删除下面的所有文件) */
    rm(fid: string): Promise<void>;
    /** 重命名文件或目录 */
    rename(fid: string, name: string): Promise<void>;
    /** 移动文件 */
    mv(fid: string, pid: string): Promise<void>;
    private _feed;
    /**
     * 上传一个文件
     * @param file string表示从该本地文件路径上传，Buffer表示直接上传这段内容
     * @param pid 上传到此目录(默认根目录)
     * @param name file为Buffer时，若留空则自动以md5命名
     * @param callback 监控上传进度的回调函数，拥有一个"百分比进度"的参数
     */
    upload(file: string | Buffer | Uint8Array, pid?: string, name?: string, callback?: (percentage: string) => void): Promise<GfsFileStat>;
    /**
     * 将文件转发到当前群
     * @param stat 另一个群中的文件属性()
     * @param pid 转发后的目录(默认根目录)
     * @param name 转发后的文件名(默认不变)
     */
    forward(stat: GfsFileStat, pid?: string, name?: string): Promise<GfsFileStat>;
    /** 获取文件下载地址 */
    download(fid: string): Promise<Omit<FileElem, "type"> & {
        url: string;
    }>;
}
export {};
