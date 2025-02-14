import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  //@UseGuards(FirebaseAuthGuard)
  async getProfile(@Req() req) {
    return this.usersService.findOrCreateUser(req.user);
  }
}
