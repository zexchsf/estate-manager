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
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { EmailPasswordLoginDto } from 'src/users/dtos/email-password-login.dto';
import { SocialAuthDto } from 'src/users/dtos/social-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('email-signup')
  async signup(@Body() emailPasswordLoginDto: EmailPasswordLoginDto) {
    return this.authService.signup(
      emailPasswordLoginDto.email,
      emailPasswordLoginDto.password,
    );
  }

  @Post('email-login')
  async login(
    @Body() emailPasswordLoginDto: EmailPasswordLoginDto,
    @Res() res: Response,
  ) {
    const { user, token } = await this.authService.signin(
      emailPasswordLoginDto.email,
      emailPasswordLoginDto.password,
    );
    res.cookie('jwt', token, { httpOnly: true, secure: true });
    return res.send({ success: true, user });
  }

  @Post('google-auth')
  async googleAuth(@Body() socialAuthDto: SocialAuthDto) {
    try {
      return await this.authService.verifyFirebaseToken(socialAuthDto.idToken);
    } catch (error) {
      throw new HttpException(
        'Google authentication failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('facebook-auth')
  async facebookAuth(@Body() socialAuthDto: SocialAuthDto) {
    try {
      return await this.authService.verifyFirebaseToken(socialAuthDto.idToken);
    } catch (error) {
      throw new HttpException(
        'Facebook authentication failed',
        HttpStatus.UNAUTHORIZED,
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
