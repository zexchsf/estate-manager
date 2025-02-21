import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EstatesService } from './estates.service';

@Controller('estates')
export class EstatesController {
  constructor(private readonly estatesService: EstatesService) { }

  // Create a new estate
  @Post('create')
  async createEstate(
    @Body('name') name: string,
    @Body('ownerId') ownerId: string,
  ) {
    return this.estatesService.createEstate(name, ownerId);
  }

  // Add a resident to an estate
  @Post(':estateId/add-resident')
  async addResident(
    @Param('estateId') estateId: string,
    @Body('userId') userId: string,
  ) {
    return this.estatesService.addResident(estateId, userId);
  }

  @Get()
  async getEstates() {
    return 'Torama Estates'
  }
}
