import { Injectable, NotFoundException } from '@nestjs/common';
import { EstatesRepository } from './estates.repository';
import { Estate, EstateDocument } from './estates.schema';

@Injectable()
export class EstatesService {
  constructor(private estatesRepository: EstatesRepository) {}

  async getAllEstates(): Promise<EstateDocument[]> {
    return await this.estatesRepository.findAll();
  }

  async getEstateById(estateId: string): Promise<EstateDocument> {
    const estate = await this.estatesRepository.findById(estateId);
    if (!estate) {
      throw new NotFoundException(`Estate with ID ${estateId} not found`);
    }
    return estate;
  }

  async createEstate(userId: string, estateData: Partial<Estate>) {
    return this.estatesRepository.create(userId, estateData);
  }

  async addResident(estateId: string, userId: string) {
    return this.estatesRepository.addResident(estateId, userId);
  }
}
