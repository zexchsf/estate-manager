import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { firebaseAuth } from './firebase-admin';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body('idToken') idToken: string) {
    try {
      const decodedToken = await firebaseAuth.verifyIdToken(idToken);

      return this.usersService.findOrCreateUser(decodedToken);
    } catch (error) {
      throw new Error('Invalid Firebase ID token');
    }
  }

  @Post('email-login')
  async emailLogin(@Body('email') email: string) {
    return this.authService.sendLoginCode(email);
  }

  @Post('session-login')
  async sessionLogin(@Body('idToken') idToken: string, @Res() res: Response) {
    const sessionCookie = await this.authService.createSessionCookie(idToken);
    res.cookie('session', sessionCookie, { httpOnly: true, secure: true });
    res.send({ success: true });
  }

  @Post('session-logout')
  async sessionLogout(@Res() res: Response) {
    res.clearCookie('session');
    res.send({ success: true });
  }

  @Post('verify-session')
  async verifySession(@Req() req: Request) {
    const sessionCookie = req.cookies.session;
    if (!sessionCookie) {
      return { authenticated: false };
    }
    try {
      const decodedClaims =
        await this.authService.verifySessionCookie(sessionCookie);
      return { authenticated: true, user: decodedClaims };
    } catch (error) {
      return { authenticated: false };
    }
  }
}
