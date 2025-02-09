import { Request, Response, NextFunction } from 'express';
import querystring from 'querystring';

import { UserService } from '../service/user.service';

import { logger, LoggerType } from '../utils/logger';
import { validateTelegramInitData } from '../utils/validateTelegramInitData';
import { handleResponse } from '../utils/handleResponse';

export class TelegramController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async validateInitData(req: Request, res: Response, next: NextFunction) {
    logger({ type: LoggerType.Info, message: 'validateInitData' });

    try {
      const { initData } = req.body;

      const parsedData = querystring.parse(initData);
      const isValid = validateTelegramInitData(initData);

      let userObject = null;
      if (parsedData?.user && typeof parsedData?.user === 'string') {
        try {
          userObject = JSON.parse(parsedData.user);
        } catch (error) {
          logger({ type: LoggerType.Error, message: 'Failed to parse user JSON::: ', meta: error });
        }
      }

      return handleResponse(res, 200, 'Success!', {
        isValid,
        user: userObject,
      });
    } catch (error) {
      logger({ type: LoggerType.Error, message: 'ERROR. validateInitData::: ', meta: error });

      return next(error);
    }
  }

  async setProgress(req: Request, res: Response, next: NextFunction) {
    logger({ type: LoggerType.Info, message: 'setProgress' });

    try {
      const { telegramUserId, coins } = req.body;

      const user = await this.userService.getUser({ telegramUserId });

      if (!user) {
        return handleResponse(res, 400, 'User not found!');
      }

      const updatedUser = await this.userService.updateUser({ _id: user._id }, { coins });

      if (!updatedUser) {
        return handleResponse(res, 400, 'User was not updated!');
      }

      return handleResponse(res, 201, 'User updated successfully!', { user: updatedUser });
    } catch (error) {
      logger({ type: LoggerType.Error, message: 'ERROR. setProgress::: ', meta: error });

      return next(error);
    }
  }
}
