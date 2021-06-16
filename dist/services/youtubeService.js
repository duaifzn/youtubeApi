"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const youtube_1 = require("../models/youtube");
const youtubeComment_1 = require("../models/youtubeComment");
const youtubeChannelId_1 = require("../models/youtubeChannelId");
const config_1 = require("../config/config");
const config = config_1.Config[process.env.NODE_ENV];
const mongoUri = config.mongoUri;
class YoutubeService {
    constructor() {
        this.Youtube = null;
        this.YoutubeComment = null;
        this.YoutubeChannelId = null;
        this.connectMongo();
    }
    connectMongo() {
        mongoose_1.default.connect(mongoUri, {
            authSource: 'admin',
            user: 'eagle',
            pass: 'eagle-eye',
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });
        const db = mongoose_1.default.connection;
        db.once('open', () => {
            console.log('mongodb connect!');
            this.Youtube = db.model('Youtube', youtube_1.youtubeSchema);
            this.YoutubeComment = db.model('YoutubeComment', youtubeComment_1.youtubeCommentSchema);
            this.YoutubeChannelId = db.model('YoutubeChannelId', youtubeChannelId_1.youtubeChannelIdSchema);
        });
        db.on('error', () => {
            console.log('mongodb error!!');
        });
    }
    createVideo(video) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.Youtube.create({
                    href: video.href,
                    publishedAt: video.publishedAt,
                    desc: video.desc,
                    img: video.img,
                    title: video.title,
                    channel: video.channel,
                    webSite: video.webSite
                });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    createComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.YoutubeComment.create({
                    videoId: comment.videoId,
                    commentId: comment.commentId,
                    parentId: comment.parentId,
                    authorName: comment.authorName,
                    text: comment.text,
                    likeCount: comment.likeCount,
                    publishedAt: comment.publishedAt,
                });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    createChannelId(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.YoutubeChannelId.create({
                    channelId: channelId
                });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    getChannelIds() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let channelIds = yield this.YoutubeChannelId.find({});
                return channelIds.map(channelId => {
                    return channelId.channelId;
                });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}
exports.default = YoutubeService;
//# sourceMappingURL=youtubeService.js.map