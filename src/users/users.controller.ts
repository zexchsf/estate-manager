import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import { HybridAuthGuard } from 'src/auth/guards/hybrid-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(HybridAuthGuard)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req) {
    console.log('Users api');
    console.log('req.user:', req.user);
    return this.usersService.findOrCreateUser(req.user);
  }

  @Patch('change-password')
  @ApiBearerAuth()
  @UseGuards(HybridAuthGuard)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid old password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @Req() req,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.usersService.changePassword(
      req.user.id,
      body.oldPassword,
      body.newPassword,
    );
  }
}
