import { Markup } from 'telegraf';

import { MESSAGES_ENG } from '../service/telegram.service/locales/messages_eng';

export const WEB_APP_BUTTON = Markup.inlineKeyboard([
  Markup.button.webApp(MESSAGES_ENG.BUTTON.LETS_TAP, process.env.TG_WEB_APP_URL),
]);
