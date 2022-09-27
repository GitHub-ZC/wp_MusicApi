"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = exports.Proto = void 0;
// import * as pb from "protobufjs"
const protobuf_min_js_1 = __importDefault(require("./protobuf.min.js"));
class Proto {
    constructor(encoded, decoded) {
        this.encoded = encoded;
        if (decoded)
            Reflect.setPrototypeOf(this, decoded);
    }
    get length() {
        return this.encoded.length;
    }
    toString() {
        return this.encoded.toString();
    }
    toHex() {
        return this.encoded.toString("hex");
    }
    toBase64() {
        return this.encoded.toString("base64");
    }
    toBuffer() {
        return this.encoded;
    }
    [Symbol.toPrimitive]() {
        return this.toString();
    }
}
exports.Proto = Proto;
function _encode(writer, tag, value) {
    if (value === null || value === undefined)
        return;
    let type = 2;
    if (typeof value === "number") {
        type = Number.isInteger(value) ? 0 : 1;
    }
    else if (typeof value === "string") {
        value = Buffer.from(value);
    }
    else if (value instanceof Uint8Array) {
        //
    }
    else if (value instanceof Proto) {
        value = value.toBuffer();
    }
    else if (typeof value === "object") {
        value = encode(value);
    }
    else if (typeof value === "bigint") {
        const tmp = new protobuf_min_js_1.default.util.Long();
        tmp.unsigned = false;
        tmp.low = Number(value & 0xffffffffn);
        tmp.high = Number((value & 0xffffffff00000000n) >> 32n);
        value = tmp;
        type = 0;
    }
    else {
        return;
    }
    const head = tag << 3 | type;
    writer.uint32(head);
    switch (type) {
        case 0:
            if (value < 0)
                writer.sint64(value);
            else
                writer.int64(value);
            break;
        case 2:
            writer.bytes(value);
            break;
        case 1:
            writer.double(value);
            break;
    }
}
function encode(obj) {
    Reflect.setPrototypeOf(obj, null);
    const writer = new protobuf_min_js_1.default.Writer();
    for (const tag of Object.keys(obj).map(Number)) {
        const value = obj[tag];
        if (Array.isArray(value)) {
            for (let v of value)
                _encode(writer, tag, v);
        }
        else {
            _encode(writer, tag, value);
        }
    }
    return writer.finish();
}
exports.encode = encode;
function long2int(long) {
    if (long.high === 0)
        return long.low >>> 0;
    const bigint = (BigInt(long.high) << 32n) | (BigInt(long.low) & 0xffffffffn);
    const int = Number(bigint);
    return Number.isSafeInteger(int) ? int : bigint;
}
function decode(encoded) {
    const result = new Proto(encoded);
    const reader = new protobuf_min_js_1.default.Reader(encoded);
    while (reader.pos < reader.len) {
        const k = reader.uint32();
        const tag = k >> 3, type = k & 0b111;
        let value, decoded;
        switch (type) {
            case 0:
                value = long2int(reader.int64());
                break;
            case 1:
                value = long2int(reader.fixed64());
                break;
            case 2:
                value = Buffer.from(reader.bytes());
                try {
                    decoded = decode(value);
                }
                catch { }
                value = new Proto(value, decoded);
                break;
            case 5:
                value = reader.fixed32();
                break;
            default:
                return null;
        }
        if (Array.isArray(result[tag])) {
            result[tag].push(value);
        }
        else if (Reflect.has(result, tag)) {
            result[tag] = [result[tag]];
            result[tag].push(value);
        }
        else {
            result[tag] = value;
        }
    }
    return result;
}
exports.decode = decode;
