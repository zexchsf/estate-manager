import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
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
}
