const { Markup } = require('telegraf');

import { User } from '../../model/user.model';

import { UserService } from '../user.service';

export class TelegramActionsService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }
}
