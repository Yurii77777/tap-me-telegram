const { session } = require('telegraf');

import { bot } from '../../config/telegram.config';
import { logger, LoggerType } from '../../utils/logger';

import { TelegramCommandsService } from './telegramCommands.service';

export class TelegramService {
  private telegramCommandsService: TelegramCommandsService;

  constructor() {
    this.telegramCommandsService = new TelegramCommandsService();
  }

  async handleBotEvents() {
    try {
      await this.telegramCommandsService.setBotCommands();
    } catch (error) {
      logger({ type: LoggerType.Error, message: 'ERROR! handleBotEvents:::', meta: error });
    }

    // Scenes
    bot.use(session());

    bot.command('start', async (ctx: any) => {
      try {
        await this.telegramCommandsService.handleStartCommand(ctx);
      } catch (error) {
        logger({ type: LoggerType.Error, message: 'ERROR handleStartCommand:::', meta: error });
      }
    });

    bot.command('tap_me', async (ctx: any) => {
      try {
        await this.telegramCommandsService.handleTapMeCommand(ctx);
      } catch (error) {
        console.log(`[Error handleTapMeCommand :::`, error);
        logger({ type: LoggerType.Error, message: 'ERROR handleTapMeCommand:::', meta: error });
      }
    });

    bot.launch();
  }
}
