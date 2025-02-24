import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: {
    uid: string;
    email: string;
    password: string;
  }): Promise<User> {
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
          uid: decodedToken.uid || decodedToken.user_id,
          email: decodedToken.email,
          name: decodedToken.name || 'Unknown',
          phone: decodedToken.phone_number || 'N/A',
          role: 'user',
        });

        await user.save();
      }

      return user;
    } catch (error) {
      console.error('Error in findOrCreate:', error);
      throw new InternalServerErrorException('Error in findOrCreateUser');
    }
  }

  async updateRole(userId: string, role: string) {
    return this.userModel.findByIdAndUpdate(userId, { role }, { new: true });
  }
}
