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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtubeChannelData = void 0;
const youtubeService_1 = __importDefault(require("../services/youtubeService"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
const config = config_1.Config[process.env.NODE_ENV];
const youtubeService = new youtubeService_1.default();
const youtubeKey = config.youtubeKey;
function youtubeChannelData(channelId) {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
    return __awaiter(this, void 0, void 0, function* () {
        if (!channelId)
            return;
        const baseUrl = 'https://www.youtube.com/watch?v=';
        // get playlistId
        const config1 = {
            method: 'get',
            url: `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${youtubeKey}`,
        };
        let res = yield axios_1.default(config1);
        const playlistId = res.data.items[0].contentDetails.relatedPlaylists.uploads;
        //--------------
        //get video news
        let videoIds = [];
        const config2 = {
            method: 'get',
            url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&playlistId=${playlistId}&key=${youtubeKey}&maxResults=50`,
        };
        res = yield axios_1.default(config2);
        try {
            for (var _e = __asyncValues(res.data.items), _f; _f = yield _e.next(), !_f.done;) {
                const item = _f.value;
                videoIds.push(item.contentDetails.videoId);
                yield youtubeService.createVideo({
                    videoId: item.contentDetails.videoId,
                    href: baseUrl + item.snippet.resourceId.videoId,
                    publishedAt: item.snippet.publishedAt,
                    desc: item.snippet.description,
                    img: item.snippet.thumbnails.default.url,
                    title: item.snippet.title,
                    channel: item.snippet.channelTitle,
                    webSite: 'youtube',
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) yield _a.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            //---------------
            //get video comments
            for (var videoIds_1 = __asyncValues(videoIds), videoIds_1_1; videoIds_1_1 = yield videoIds_1.next(), !videoIds_1_1.done;) {
                const videoId = videoIds_1_1.value;
                let config3 = {
                    method: 'get',
                    url: `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&key=${youtubeKey}&order=relevance`
                };
                let res = yield axios_1.default(config3);
                try {
                    for (var _g = (e_3 = void 0, __asyncValues(res.data.items)), _h; _h = yield _g.next(), !_h.done;) {
                        const item = _h.value;
                        yield youtubeService.createComment({
                            videoId: item.snippet.videoId,
                            commentId: item.id,
                            parentId: null,
                            authorName: item.snippet.topLevelComment.snippet.authorDisplayName,
                            text: item.snippet.topLevelComment.snippet.textOriginal,
                            likeCount: item.snippet.topLevelComment.snippet.likeCount,
                            publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
                        });
                        if (item.replies) {
                            try {
                                for (var _j = (e_4 = void 0, __asyncValues(item.replies.comments)), _k; _k = yield _j.next(), !_k.done;) {
                                    const reply = _k.value;
                                    yield youtubeService.createComment({
                                        videoId: reply.snippet.videoId,
                                        commentId: reply.id,
                                        parentId: reply.snippet.parentId,
                                        authorName: reply.snippet.authorDisplayName,
                                        text: reply.snippet.textOriginal,
                                        likeCount: reply.snippet.likeCount,
                                        publishedAt: reply.snippet.publishedAt,
                                    });
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (_k && !_k.done && (_d = _j.return)) yield _d.call(_j);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_c = _g.return)) yield _c.call(_g);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (videoIds_1_1 && !videoIds_1_1.done && (_b = videoIds_1.return)) yield _b.call(videoIds_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
}
exports.youtubeChannelData = youtubeChannelData;
//# sourceMappingURL=youtubeApi.js.map