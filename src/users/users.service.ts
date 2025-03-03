import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(userData: {
    uid: string;
    email: string;
    password: string;
  }): Promise<User> {
    return this.usersRepository.create(userData);
  }

  async find(email: string): Promise<User | null> {
    return this.usersRepository.find(email);
  }

  async findOrCreateUser(decodedToken: any): Promise<User> {
    return this.usersRepository.findOrCreate(decodedToken);
  }

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<string> {
    const user = await this.usersRepository.findByUid(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }
    // Update password
    await this.usersRepository.updatePassword(id, newPassword);
    return 'Password changed successfully';
  }
}
