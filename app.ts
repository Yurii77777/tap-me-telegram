import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');

import { TelegramService } from './service/telegram.service/mainTelegram.service';
import { TelegramController } from './controller/telegram.controller';

import { validateInitDataMiddleware, validateProgressDataMiddleware } from './middlewares/telegram.middleware';
import { handleValidate } from './middlewares/handleValidate';
import { handleResponse } from './utils/handleResponse';
import { logger, LoggerType } from './utils/logger';

class App {
  public express: express.Application;
  public telegramService: TelegramService;
  public telegramController: TelegramController;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.telegramService = new TelegramService();
    this.telegramService.handleBotEvents();
    this.telegramController = new TelegramController();
  }

  // Configure Express middleware.
  private middleware(): void {
    const corsOptions = {
      origin: '*',
      credentials: true, //access-control-allow-credentials:true
      optionSuccessStatus: 200,
    };

    this.express.use(cors(corsOptions));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    // For health check:
    this.express.get('/healthcheck', (req, res, next) => {
      res.send('Ok!');
    });

    this.express.post('/api/validate', validateInitDataMiddleware, handleValidate, (req, res, next) => {
      this.telegramController.validateInitData(req, res, next);
    });

    this.express.post('/api/progress', validateProgressDataMiddleware, handleValidate, (req, res, next) => {
      this.telegramController.setProgress(req, res, next);
    });

    // global error handler
    this.express.use((error, req, res, next) => {
      logger({ type: LoggerType.Error, message: 'GLOBAL ERROR!', meta: error });
      return handleResponse(res, 500, error.statusMessage, undefined, error);
    });

    // handle undefined routes
    this.express.use('*', (req, res, next) => {
      res.status(404).send('API endpoint not found');
    });
  }
}

export default new App().express;
