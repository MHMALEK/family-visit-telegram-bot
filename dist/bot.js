"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const grammy_1 = require("grammy");
const menu_1 = require("@grammyjs/menu");
const dotEnv = __importStar(require("dotenv"));
const content_1 = __importDefault(require("./content"));
const contentService = new content_1.default();
dotEnv.config();
let bot;
let botRunning = false;
const telegramBotApiToken = process.env.TELEGRAM_BOT_API_TOKEN;
const initBot = () => __awaiter(void 0, void 0, void 0, function* () {
    if (botRunning)
        return; // If bot is already running, don't initialize again
    botRunning = true; // Set botRunning flag to true
    const content = yield contentService.getShortStayVisaWithSponsorShipContent();
    const mainMenu = {
        menu: new menu_1.Menu("main-menu"),
        mainText: "سلام!‌این ربات بهتون کمک میکنه اطلاعات لازم برای ویزای کوتاه مدت مثل دعوت از دوستان یا خانواده رو به دست بیارید!",
        steps: [
            {
                label: "ویزای کوتاه مدت دعوت از خانواده یا دوستان",
                payload: "family-short-stay-visa-menu",
            },
        ],
    };
    for (const mainMenuItem of mainMenu.steps) {
        mainMenu.menu.submenu(mainMenuItem.label, mainMenuItem.payload).row();
    }
    const familyShortStayVisaMenu = {
        menu: new menu_1.Menu("family-short-stay-visa-menu"),
        mainText: "اطلاعات مورد نظر برای دعوت از دوستان یا خانواده به هلند از ایران رو میتونید اینجا مشاهده کنید.",
        steps: [
            {
                label: "شرایط مورد نیاز برای دعوت از خانواده",
                payload: "sponsorRequirements",
            },
            {
                label: "مراحل دعوت از دوستان/خانواده",
                payload: "flow",
            },
            {
                label: "مدارک مورد نیاز",
                payload: "documents",
            },
            {
                label: "عکس مورد قبول سفارت هلند",
                payload: "pictureRules",
            },
            {
                label: "قوانین کلی",
                payload: "generalRules",
            },
            {
                label: "هزینه‌ها",
                payload: "costs",
            },
            // {
            //   label: 'سوالاتون هنوز جواب داده نشده؟ در گروه ویزا بپرسین!',
            //   payload: 'join-visa-group',
            // },
        ],
    };
    for (const familyShortStayVisaMenuMenuItem of familyShortStayVisaMenu.steps) {
        familyShortStayVisaMenu.menu
            .text(familyShortStayVisaMenuMenuItem.label, (ctx) => ctx.reply(content[familyShortStayVisaMenuMenuItem.payload], {
            parse_mode: "Markdown",
        }))
            .row();
    }
    familyShortStayVisaMenu.menu.back("بازگشت");
    bot.use(mainMenu.menu);
    mainMenu.menu.register(familyShortStayVisaMenu.menu);
    bot.command("start", (ctx) => ctx.reply(mainMenu.mainText, { reply_markup: mainMenu.menu }));
    bot.catch(console.error.bind(console));
    bot.start();
});
const createBotInstance = (apiToken) => {
    const bot = new grammy_1.Bot(apiToken);
    return bot;
};
if (!botRunning) {
    bot = createBotInstance(telegramBotApiToken);
}
process.once("SIGINT", () => {
    bot.stop();
    botRunning = false;
});
process.once("SIGTERM", () => {
    bot.stop();
    botRunning = false;
});
initBot();
