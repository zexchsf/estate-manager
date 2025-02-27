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
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { HybridAuthGuard } from 'src/auth/hybrid-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(HybridAuthGuard)
  async getProfile(@Req() req) {
    console.log('Users api');
    console.log('req.user:', req.user);
    return this.usersService.findOrCreateUser(req.user);
  }

  @Patch('change-password')
  @UseGuards(HybridAuthGuard)
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
