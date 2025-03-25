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
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { EmailPasswordLoginDto } from 'src/users/dtos/email-password-login.dto';
import { SocialAuthDto } from 'src/users/dtos/social-auth.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('email-signup')
  @ApiOperation({ summary: 'Sign up with email and password' })
  @ApiResponse({ status: 201, description: 'User signed up successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async signup(@Body() emailPasswordLoginDto: EmailPasswordLoginDto) {
    return this.authService.signup(
      emailPasswordLoginDto.email,
      emailPasswordLoginDto.password,
    );
  }

  @Post('email-login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() emailPasswordLoginDto: EmailPasswordLoginDto,
    @Res() res: Response,
  ) {
    const data = await this.authService.signin(
      emailPasswordLoginDto.email,
      emailPasswordLoginDto.password,
    );
    return res.send({ success: true, data });
  }

  @Post('google-auth')
  @ApiOperation({ summary: 'Authenticate using Google ID token' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
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
  @ApiOperation({ summary: 'Authenticate using Facebook ID token' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
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
  @ApiOperation({ summary: 'Create a session login with Firebase ID token' })
  @ApiResponse({ status: 200, description: 'Session created successfully' })
  @ApiResponse({ status: 500, description: 'Failed to create session' })
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
  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: 'Log out and clear session' })
  @ApiResponse({ status: 200, description: 'Session cleared successfully' })
  @ApiResponse({ status: 500, description: 'Failed to clear session' })
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
  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: 'Verify session authentication' })
  @ApiResponse({ status: 200, description: 'Session verified successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired session' })
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
