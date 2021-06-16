"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtubeChannelIdSchema = void 0;
const mongoose_1 = require("mongoose");
exports.youtubeChannelIdSchema = new mongoose_1.Schema({
    channelId: {
        type: String, require: true
    },
}, { timestamps: true, collection: 'youtubeChannelId' });
//# sourceMappingURL=youtubeChannelId.js.map