import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User, UserDocument } from './users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(userData: { email: string; password: string }): Promise<User> {
    return this.usersRepository.create(userData);
  }

  async find(email: string): Promise<UserDocument | null> {
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
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password || "");
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }
    // Update password
    await this.usersRepository.updatePassword(id, newPassword);
    return 'Password changed successfully';
  }

  async promoteToAdmin(email: string) {
    const user = await this.usersRepository.find(email);
    if (!user) throw new NotFoundException('User not found');

    user.role = 'admin';
    await user.save();
    return user;
  }
}
