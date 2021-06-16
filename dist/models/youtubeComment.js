"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtubeCommentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.youtubeCommentSchema = new mongoose_1.Schema({
    videoId: {
        type: String, require: true
    },
    commentId: {
        type: String, require: true
    },
    parentId: {
        type: String
    },
    authorName: {
        type: String, require: true
    },
    text: {
        type: String, require: true
    },
    likeCount: {
        type: Number, require: true
    },
    publishedAt: {
        type: Date, require: true
    }
}, { timestamps: true, collection: 'youtubeComment' });
//# sourceMappingURL=youtubeComment.js.map