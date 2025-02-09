import { User } from '../model/user.model';

import { UserRepository } from '../repository/user.repository';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUser(user): Promise<User> {
    return await this.userRepository.getUser(user);
  }

  async createUser(user): Promise<User> {
    return await this.userRepository.createUser(user);
  }

  async updateUser(user, update): Promise<User> {
    return await this.userRepository.updateUser(user, update);
  }

  async deleteUser(user): Promise<{ status: boolean }> {
    return await this.userRepository.deleteUser(user);
  }
}
