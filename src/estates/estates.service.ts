import { Injectable } from '@nestjs/common';
import { EstatesRepository } from './estates.repository';

@Injectable()
export class EstatesService {
  constructor(private estatesRepository: EstatesRepository) {}

  async createEstate(name: string, ownerId: string) {
    return this.estatesRepository.create({ name, ownerId });
  }

  async addResident(estateId: string, userId: string) {
    return this.estatesRepository.addResident(estateId, userId);
  }
}
