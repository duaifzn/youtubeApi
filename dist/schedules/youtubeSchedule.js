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
const node_cron_1 = __importDefault(require("node-cron"));
const youtubeApi_1 = require("../controllers/youtubeApi");
const youtubeService_1 = __importDefault(require("../services/youtubeService"));
const youtubeService = new youtubeService_1.default();
class YoutubeSchedule {
    constructor() {
    }
    runSchedule() {
        return __awaiter(this, void 0, void 0, function* () {
            node_cron_1.default.schedule('* 2 * * *', () => __awaiter(this, void 0, void 0, function* () {
                var e_1, _a;
                console.log('run schedule');
                const channelIds = yield youtubeService.getChannelIds();
                console.log(channelIds);
                try {
                    for (var channelIds_1 = __asyncValues(channelIds), channelIds_1_1; channelIds_1_1 = yield channelIds_1.next(), !channelIds_1_1.done;) {
                        const channelId = channelIds_1_1.value;
                        yield youtubeApi_1.youtubeChannelData(channelId);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (channelIds_1_1 && !channelIds_1_1.done && (_a = channelIds_1.return)) yield _a.call(channelIds_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }));
        });
    }
}
exports.default = YoutubeSchedule;
//# sourceMappingURL=youtubeSchedule.js.map