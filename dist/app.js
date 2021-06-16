"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_1 = __importDefault(require("./routes/route"));
const youtubeSchedule_1 = __importDefault(require("./schedules/youtubeSchedule"));
const youtubeSchedule = new youtubeSchedule_1.default();
const app = express_1.default();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/', route_1.default);
app.listen(port, () => {
    console.log(`server running on port ${port}`);
    youtubeSchedule.runSchedule();
});
//# sourceMappingURL=app.js.map