import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Estate } from './estates.schema';
import { User } from 'src/users/users.schema';
import { EstateDocument } from './estates.schema';

@Injectable()
export class EstatesRepository {
  constructor(
    @InjectModel(Estate.name) private estateModel: Model<Estate>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(): Promise<EstateDocument[]> {
    try {
      const estates = await this.estateModel
        .find()
        .populate({
          path: 'ownerId',
          model: 'User',
        })
        .exec();
      return estates;
    } catch (error) {
      console.error('Error fetching estates:', error);
      throw new InternalServerErrorException('Failed to fetch estates');
    }
  }

  async findById(estateId: string): Promise<EstateDocument | null> {
    if (!Types.ObjectId.isValid(estateId)) {
      throw new Error('Invalid estate ID');
    }
    return this.estateModel.findById(estateId).populate('ownerId').exec();
  }
  async create(userId: string, estateData: Partial<Estate>) {
    // Check if the estate already exists
    const existingEstate = await this.estateModel.findOne({
      name: estateData.name,
    });
    if (existingEstate) {
      throw new BadRequestException('Estate already exists.');
    }

    // Find the user
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Assign the first creator as an admin
    user.role = 'admin';
    await user.save(); // Save the role update

    // Create the estate
    return this.estateModel.create({
      ...estateData,
      ownerId: new Types.ObjectId(userId), // Convert string to ObjectId
    });
  }

  async addResident(estateId: string, userId: string) {
    return this.estateModel.findByIdAndUpdate(estateId, {
      $push: { residents: new Types.ObjectId(userId) },
    });
  }
}
