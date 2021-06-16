"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const youtubeService_1 = __importDefault(require("../services/youtubeService"));
const youtubeService = new youtubeService_1.default();
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.render('index');
});
router.post('/youtube', (req, res) => {
    youtubeService.createChannelId(req.body.channelId);
});
exports.default = router;
//# sourceMappingURL=route.js.map