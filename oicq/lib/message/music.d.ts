/** 支持的音乐平台 */
export declare type MusicPlatform = "qq" | "163" | "migu" | "kugou" | "kuwo";
/** 构造b77音乐分享 */
export declare function buildMusic(target: number, platform: MusicPlatform, id: string, bu: number): Promise<{
    1: number;
    2: number;
    3: number;
    5: {
        1: number;
        2: string;
        3: string;
        4: string;
    };
    10: number;
    11: number;
    12: {
        10: any;
        11: any;
        12: string;
        13: any;
        14: any;
        16: any;
    };
}>;
