import { connect } from '../config/db.config';

import { User, UserModel } from '../model/user.model';
import { logger, LoggerType } from '../utils/logger';

export class UserRepository {
  constructor() {
    connect();
  }

  async createUser(user): Promise<User> {
    let data: null | User = null;

    try {
      data = await UserModel.create(user);
    } catch (error) {
      logger({ type: LoggerType.Error, message: 'Error createUser::: ', meta: error });
    }

    return data;
  }

  async getUser(user): Promise<User> {
    let data: null | User = null;

    try {
      data = await UserModel.findOne(user);
    } catch (error) {
      logger({ type: LoggerType.Error, message: 'Error getUser::: ', meta: error });
    }

    return data;
  }

  async updateUser(user, update): Promise<User> {
    let data: null | User = null;

    try {
      data = await UserModel.findOneAndUpdate(user, update, { useFindAndModify: false, new: true });
    } catch (error) {
      logger({ type: LoggerType.Error, message: 'Error updateUser::: ', meta: error });
    }

    return data;
  }

  async deleteUser(user): Promise<{ status: boolean }> {
    let data: any = {};

    try {
      data = await UserModel.deleteOne(user);
    } catch (error) {
      logger({ type: LoggerType.Error, message: 'Error deleteUser::: ', meta: error });
    }

    return { status: data.deletedCount > 0 ? true : false };
  }
}
