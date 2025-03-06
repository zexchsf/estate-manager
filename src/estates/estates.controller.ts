import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
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

import { AdminGuard } from 'src/auth/guards/admin.guard';
import { Estate, EstateDocument } from './estates.schema';

@ApiTags('Estates')
@Controller('estates')
export class EstatesController {
  constructor(private readonly estatesService: EstatesService) {}

  // Create a new estate
  @Post('create')
  @UseGuards(HybridAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new estate' })
  @ApiResponse({ status: 201, description: 'Estate created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid estate data' })
  @ApiResponse({ status: 401, description: 'Unauthorized: User ID not found' })
  async createEstate(@Req() req, @Body() estateData: Partial<Estate>) {
    const userId = req.user.id;

    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }

    return this.estatesService.createEstate(userId, estateData);
  }

  // Add a resident to an estate
  @Post(':estateId/add-resident')
  @UseGuards(HybridAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a resident to an estate' })
  @ApiResponse({ status: 200, description: 'Resident added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid estate or user ID' })
  @ApiResponse({ status: 403, description: 'Forbidden: Admin access required' })
  @ApiResponse({ status: 404, description: 'Estate not found' })
  async addResident(
    @Param('estateId') estateId: string,
    @Body() addResidentDto: AddResidentDto,
  ) {
    return this.estatesService.addResident(estateId, addResidentDto.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all estates' })
  @ApiResponse({
    status: 200,
    description: 'List of estates retrieved successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllEstates(): Promise<EstateDocument[]> {
    return await this.estatesService.getAllEstates();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific estate by ID' })
  @ApiResponse({ status: 200, description: 'Estate retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Estate not found' })
  async getEstateById(@Param('id') estateId: string): Promise<EstateDocument> {
    return await this.estatesService.getEstateById(estateId);
  }
}
