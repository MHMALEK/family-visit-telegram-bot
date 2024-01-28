import { Bot } from 'grammy';
import { Menu } from '@grammyjs/menu';
import * as dotEnv from 'dotenv';
import ContentService from './content';


const contentService = new ContentService();

dotEnv.config();

let bot: Bot;
let botRunning = false;
const telegramBotApiToken = process.env.TELEGRAM_BOT_API_TOKEN;

const createBotInstance = (apiToken) => {
  const bot = new Bot(apiToken);
  return bot;
};

if (!bot) {
  bot = createBotInstance(telegramBotApiToken);
}

process.once('SIGINT', () => {
  bot.stop();
  botRunning = false;
});
process.once('SIGTERM', () => {
  bot.stop();
  botRunning = false;
});

const initBot = async (bot: Bot) => {
  if (botRunning) return; // If bot is already running, don't initialize again

  botRunning = true; // Set botRunning flag to true
  const content = await contentService.getShortStayVisaWithSponsorShipContent();

  const mainMenu = {
    menu: new Menu('main-menu'),
    mainText:
      'سلام!‌این ربات بهتون کمک میکنه اطلاعات لازم برای ویزای کوتاه مدت مثل دعوت از دوستان یا خانواده رو به دست بیارید!',
    steps: [
      {
        label: 'ویزای کوتاه مدت دعوت از خانواده یا دوستان',
        payload: 'family-short-stay-visa-menu',
      },
      {
        label: 'ویزای توریستی (به زودی)',
        payload: 'tourist-short-stay-visa-menu',
      },
    ],
  };

  for (const mainMenuItem of mainMenu.steps) {
    mainMenu.menu.submenu(mainMenuItem.label, mainMenuItem.payload).row();
  }

  const familyShortStayVisaMenu = {
    menu: new Menu('family-short-stay-visa-menu'),
    mainText:
      'اطلاعات مورد نظر برای دعوت از دوستان یا خانواده به هلند از ایران رو میتونید اینجا مشاهده کنید.',
    steps: [
      {
        label: 'شرایط مورد نیاز برای دعوت از خانواده',
        payload: 'sponsorRequirements',
      },
      {
        label: 'مراحل دعوت از دوستان/خانواده',
        payload: 'flow',
      },
      {
        label: 'مدارک مورد نیاز',
        payload: 'documents',
      },
      {
        label: 'عکس مورد قبول سفارت هلند',
        payload: 'pictureRules',
      },
      {
        label: 'قوانین کلی',
        payload: 'generalRules',
      },
      {
        label: 'هزینه‌ها',
        payload: 'costs',
      },
      // {
      //   label: 'سوالاتون هنوز جواب داده نشده؟ در گروه ویزا بپرسین!',
      //   payload: 'join-visa-group',
      // },
    ],
  };

  for (const familyShortStayVisaMenuMenuItem of familyShortStayVisaMenu.steps) {
    familyShortStayVisaMenu.menu
      .text(familyShortStayVisaMenuMenuItem.label, (ctx) =>
        ctx.reply(content[familyShortStayVisaMenuMenuItem.payload], {
          parse_mode: 'Markdown',
        }),
      )
      .row();
  }
  familyShortStayVisaMenu.menu.back('بازگشت');

  bot.use(mainMenu.menu);

  mainMenu.menu.register(familyShortStayVisaMenu.menu as any);

  bot.command('start', (ctx) =>
    ctx.reply(mainMenu.mainText, { reply_markup: mainMenu.menu }),
  );

  bot.catch(console.error.bind(console));
  bot.start();
};

initBot(bot);
