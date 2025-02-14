import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Estate } from './estates.schema';

@Injectable()
export class EstatesRepository {
  constructor(@InjectModel(Estate.name) private estateModel: Model<Estate>) {}

  async create(estateData: Partial<Estate>) {
    return new this.estateModel(estateData).save();
  }

  async addResident(estateId: string, userId: string) {
    return this.estateModel.findByIdAndUpdate(estateId, {
      $push: { residents: userId },
    });
  }
}
