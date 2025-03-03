import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EstatesService } from './estates.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEstateDto } from './dtos/create-estate.dto';
import { AddResidentDto } from './dtos/add-resident.dto';
import { HybridAuthGuard } from 'src/auth/guards/hybrid-auth.guard';
import { ManagerGuard } from 'src/auth/guards/manager.guard';

@ApiTags('Estates')
@Controller('estates')
export class EstatesController {
  constructor(private readonly estatesService: EstatesService) {}

  // Create a new estate
  @Post('create')
  @UseGuards(HybridAuthGuard, ManagerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a resident to an estate' })
  @ApiResponse({ status: 200, description: 'Resident added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid estate or user ID' })
  async createEstate(@Body() createEstateDto: CreateEstateDto) {
    return this.estatesService.createEstate(
      createEstateDto.name,
      createEstateDto.ownerId,
    );
  }

  // Add a resident to an estate
  @Post(':estateId/add-resident')
  @UseGuards(HybridAuthGuard, ManagerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all estates' })
  @ApiResponse({
    status: 200,
    description: 'List of estates retrieved successfully',
  })
  async addResident(
    @Param('estateId') estateId: string,
    @Body() addResidentDto: AddResidentDto,
  ) {
    return this.estatesService.addResident(estateId, addResidentDto.userId);
  }

  @Get()
  async getEstates() {
    return 'Torama Estates';
  }
}
