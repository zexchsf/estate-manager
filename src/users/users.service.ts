import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findOrCreateUser(decodedToken: any): Promise<User> {
    return this.usersRepository.findOrCreate(decodedToken);
  }
  async promoteToMember(userId: string) {
    return this.usersRepository.updateRole(userId, 'member');
  }
}
