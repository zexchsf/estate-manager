import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: { email: string; password: string }): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async find(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOrCreate(decodedToken: any): Promise<UserDocument> {
    console.log(this.userModel.db.readyState); // Should be 1 if connected
    try {
      let user = await this.userModel
        .findOne({ email: decodedToken.email })
        .exec();

      if (!user) {
        user = new this.userModel({
          _id: new mongoose.Types.ObjectId(),
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || 'Unknown',
          phone: decodedToken.phone_number || 'N/A',
          role: 'user',
        });

        await user.save();
      }

      return user.toObject();
    } catch (error) {
      console.error('Error in findOrCreate:', error);
      throw new InternalServerErrorException('Error in findOrCreateUser');
    }
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.userModel.updateOne(
      { _id: userId },
      { password: hashedPassword },
    );
  }

  async updateRole(userId: string, role: string) {
    return this.userModel.findByIdAndUpdate(userId, { role }, { new: true });
  }
}
