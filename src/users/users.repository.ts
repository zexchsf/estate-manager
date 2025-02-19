import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // async findOrCreate(decodedToken: any): Promise<UserDocument> {
  //   try {
  //     let user = await this.userModel
  //       .findOne({ email: decodedToken.email })
  //       .exec();
  //     if (!user) {
  //       user = new this.userModel({
  //         uid: decodedToken.uid || decodedToken.user_id,
  //         email: decodedToken.email,
  //         name: decodedToken.name,
  //         phone: decodedToken.phone_number,
  //         role: 'user',
  //       });
  //       await user.save();
  //     }
  //     return user;
  //   } catch (error) {
  //     throw new InternalServerErrorException('Error in findOrCreate');
  //   }
  // }

  async findOrCreate(decodedToken: any): Promise<UserDocument> {
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
      throw new InternalServerErrorException('Error in findOrCreateUser');
    }
  }

  async updateRole(userId: string, role: string) {
    return this.userModel.findByIdAndUpdate(userId, { role }, { new: true });
  }
}
