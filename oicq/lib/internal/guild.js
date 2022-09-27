"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guildMsgListener = exports.GuildMessageEvent = void 0;
const crypto_1 = require("crypto");
const core_1 = require("../core");
const common_1 = require("../common");
const message_1 = require("../message");
class GuildMessageEvent {
    constructor(proto) {
        const head1 = proto[1][1][1];
        const head2 = proto[1][1][2];
        if (head2[1] !== 3840)
            throw new Error("unsupport guild message type");
        const body = proto[1][3];
        const extra = proto[1][4];
        this.guild_id = String(head1[1]);
        this.channel_id = String(head1[2]);
        this.guild_name = String(extra[2]);
        this.channel_name = String(extra[3]);
        this.sender = {
            tiny_id: String(head1[4]),
            nickname: String(extra[1])
        };
        this.seq = head2[4];
        this.rand = head2[3];
        this.time = head2[6];
        const parsed = (0, message_1.parse)(body[1]);
        this.message = parsed.message;
        this.raw_message = parsed.brief;
        (0, common_1.lock)(this, "proto");
    }
}
exports.GuildMessageEvent = GuildMessageEvent;
function guildMsgListener(payload) {
    try {
        var msg = new GuildMessageEvent(core_1.pb.decode(payload));
    }
    catch {
        return;
    }
    if (msg.sender.tiny_id === this.tiny_id && this.config.ignore_self)
        return;
    this.logger.info(`recv from: [Guild: ${msg.guild_name}, Member: ${msg.sender.nickname}]` + msg.raw_message);
    msg.reply = (content) => {
        const converter = new message_1.Converter(content);
        this.writeUni("MsgProxy.SendMsg", core_1.pb.encode({
            1: {
                1: {
                    1: {
                        1: BigInt(msg.guild_id),
                        2: Number(msg.channel_id),
                        3: this.uin
                    },
                    2: {
                        1: 3840,
                        3: (0, crypto_1.randomBytes)(4).readUInt32BE()
                    }
                },
                3: {
                    1: converter.rich
                }
            }
        }));
    };
    this.em("guild.message", msg);
}
exports.guildMsgListener = guildMsgListener;
// export function guildListPushListener(this: Client, payload: Buffer) {
// 	const rsp = pb.decode(payload)
// 	if (!rsp[3]) return
// 	if (!Array.isArray(rsp[3])) rsp[3] = [rsp[3]]
// 	const tmp = new Set<string>()
// 	for (let proto of rsp[3]) {
// 		const id = String(proto[1])
// 		tmp.add(id)
// 		if (this.guildmap.has(id)) {
// 			this.guildmap.get(id)!.name = String(proto[4])
// 		} else {
// 			this.guildmap.set(id, new Guild(this, proto))
// 		}
// 	}
// 	for (let [id, _] of this.guildmap) {
// 		if (!tmp.has(id))
// 			this.guildmap.delete(id)
// 	}
// 	this.emit("internal.loadguilds")
// }
