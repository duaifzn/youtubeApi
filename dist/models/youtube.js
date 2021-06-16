"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtubeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.youtubeSchema = new mongoose_1.Schema({
    videoId: {
        type: String, require: true
    },
    href: {
        type: String, require: true
    },
    publishedAt: {
        type: Date, require: true
    },
    desc: {
        type: String, require: true
    },
    img: {
        type: String, require: true
    },
    title: {
        type: String, require: true
    },
    channel: {
        type: String, require: true
    },
    webSite: {
        type: String, require: true
    },
}, { timestamps: true, collection: 'youtube' });
//# sourceMappingURL=youtube.js.map