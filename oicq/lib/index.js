"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrResult = exports.core = exports.Platform = exports.ApiRejection = exports.segment = exports.getGroupImageUrl = exports.parseImageFileParam = exports.parseGroupMessageId = exports.parseDmMessageId = exports.ForwardMessage = exports.DiscussMessage = exports.GroupMessage = exports.PrivateMessage = exports.Message = exports.LoginErrorCode = exports.ErrorCode = exports.OnlineStatus = exports.Gfs = exports.Member = exports.Group = exports.Discuss = exports.Friend = exports.User = exports.createClient = exports.Client = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return client_1.Client; } });
Object.defineProperty(exports, "createClient", { enumerable: true, get: function () { return client_1.createClient; } });
var friend_1 = require("./friend");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return friend_1.User; } });
Object.defineProperty(exports, "Friend", { enumerable: true, get: function () { return friend_1.Friend; } });
var group_1 = require("./group");
Object.defineProperty(exports, "Discuss", { enumerable: true, get: function () { return group_1.Discuss; } });
Object.defineProperty(exports, "Group", { enumerable: true, get: function () { return group_1.Group; } });
var member_1 = require("./member");
Object.defineProperty(exports, "Member", { enumerable: true, get: function () { return member_1.Member; } });
var gfs_1 = require("./gfs");
Object.defineProperty(exports, "Gfs", { enumerable: true, get: function () { return gfs_1.Gfs; } });
var common_1 = require("./common");
Object.defineProperty(exports, "OnlineStatus", { enumerable: true, get: function () { return common_1.OnlineStatus; } });
var errors_1 = require("./errors");
Object.defineProperty(exports, "ErrorCode", { enumerable: true, get: function () { return errors_1.ErrorCode; } });
Object.defineProperty(exports, "LoginErrorCode", { enumerable: true, get: function () { return errors_1.LoginErrorCode; } });
var message_1 = require("./message");
Object.defineProperty(exports, "Message", { enumerable: true, get: function () { return message_1.Message; } });
Object.defineProperty(exports, "PrivateMessage", { enumerable: true, get: function () { return message_1.PrivateMessage; } });
Object.defineProperty(exports, "GroupMessage", { enumerable: true, get: function () { return message_1.GroupMessage; } });
Object.defineProperty(exports, "DiscussMessage", { enumerable: true, get: function () { return message_1.DiscussMessage; } });
Object.defineProperty(exports, "ForwardMessage", { enumerable: true, get: function () { return message_1.ForwardMessage; } });
Object.defineProperty(exports, "parseDmMessageId", { enumerable: true, get: function () { return message_1.parseDmMessageId; } });
Object.defineProperty(exports, "parseGroupMessageId", { enumerable: true, get: function () { return message_1.parseGroupMessageId; } });
Object.defineProperty(exports, "parseImageFileParam", { enumerable: true, get: function () { return message_1.parseImageFileParam; } });
Object.defineProperty(exports, "getGroupImageUrl", { enumerable: true, get: function () { return message_1.getGroupImageUrl; } });
Object.defineProperty(exports, "segment", { enumerable: true, get: function () { return message_1.segment; } });
var core_1 = require("./core");
Object.defineProperty(exports, "ApiRejection", { enumerable: true, get: function () { return core_1.ApiRejection; } });
Object.defineProperty(exports, "Platform", { enumerable: true, get: function () { return core_1.Platform; } });
exports.core = __importStar(require("./core"));
var internal_1 = require("./internal");
Object.defineProperty(exports, "OcrResult", { enumerable: true, get: function () { return internal_1.OcrResult; } });
