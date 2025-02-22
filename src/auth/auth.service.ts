import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firebaseAuth } from './firebase-admin';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(token: string) {
    try {
      const decodedToken = await firebaseAuth.verifyIdToken(token);
      return this.userService.findOrCreateUser(decodedToken);
    } catch (error) {
      throw new HttpException(
        'Invalid or expired Firebase ID token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async sendLoginCode(email: string) {
    try {
      const link = await firebaseAuth.generateSignInWithEmailLink(email, {
        url: 'https://estateapi.torama.ng', //process.env.FRONTEND_URL as string,
        handleCodeInApp: true,
      });
      return { email, link };
    } catch (error) {
      throw new HttpException(
        'Failed to send login code',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createSessionCookie(idToken: string) {
    try {
      const expiresIn = 60 * 60 * 1000; // 60 minutes
      const sessionCookie = await firebaseAuth.createSessionCookie(idToken, {
        expiresIn,
      });
      return sessionCookie;
    } catch (error) {
      throw new HttpException(
        'Failed to create session cookie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifySessionCookie(sessionCookie: string) {
    try {
      return firebaseAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      throw new HttpException(
        'Invalid or expired session cookie',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
