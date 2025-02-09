import { bot } from '../../config/telegram.config';

import { User } from '../../model/user.model';

import { UserService } from '../user.service';

import { MESSAGES_ENG } from './locales/messages_eng';
import { logger, LoggerType } from '../../utils/logger';
import { WEB_APP_BUTTON } from '../../constants/buttons.constants';

export class TelegramCommandsService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async setBotCommands() {
    bot.telegram.setMyCommands([
      {
        command: '/start',
        description: "Let's start",
      },
      {
        command: '/tap_me',
        description: 'Tap Me App',
      },
    ]);
  }

  async handleStartCommand(ctx) {
    const { id: telegramUserId, first_name, username } = ctx?.update?.message?.chat;

    let user: null | User = null;

    try {
      user = await this.userService.getUser({ telegramUserId });
    } catch (error) {
      await ctx.reply(MESSAGES_ENG.DB_REQUEST_ERROR);
    }

    // Create new user
    if (!user) {
      try {
        await this.userService.createUser({ telegramUserId, telegramName: first_name || username });
      } catch (error) {
        await ctx.reply(MESSAGES_ENG.DB_REQUEST_ERROR);

        return;
      }

      try {
        await ctx.reply(MESSAGES_ENG.SUCCESS_USER_CREATE, WEB_APP_BUTTON);
      } catch (error) {
        logger({ type: LoggerType.Error, message: 'ERROR! Send message::: ', meta: error });
      }
    }
    // Exist user
    else {
      const { telegramName } = user;

      try {
        await ctx.reply(MESSAGES_ENG.RETRIVED_USER_PROFILE.replace('{USER_NAME}', telegramName), WEB_APP_BUTTON);
      } catch (error) {
        logger({ type: LoggerType.Error, message: 'ERROR! Send message::: ', meta: error });
      }
    }
  }

  async handleTapMeCommand(ctx) {
    const { id: chatId, first_name, username } = ctx?.update?.message?.chat;
    console.log('chatId', chatId);
  }
}
