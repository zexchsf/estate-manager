import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { firebaseAuth } from './firebase-admin';
import { FirebaseAuthGuard } from './firebase-auth.guard';

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
      throw new HttpException(
        'Invalid Firebase ID token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('email-login')
  async emailLogin(@Body('email') email: string) {
    try {
      return await this.authService.sendLoginCode(email);
    } catch (error) {
      throw new HttpException(
        'Failed to send login code',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('session-login')
  async sessionLogin(@Body('idToken') idToken: string, @Res() res: Response) {
    try {
      const sessionCookie = await this.authService.createSessionCookie(idToken);
      res.cookie('session', sessionCookie, { httpOnly: true, secure: true });
      res.send({ success: true });
    } catch (error) {
      throw new HttpException(
        'Failed to create session cookie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('session-logout')
  @UseGuards(FirebaseAuthGuard)
  async sessionLogout(@Res() res: Response) {
    try {
      res.clearCookie('session');
      res.send({ success: true });
    } catch (error) {
      throw new HttpException(
        'Failed to clear session cookie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('verify-session')
  @UseGuards(FirebaseAuthGuard)
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
