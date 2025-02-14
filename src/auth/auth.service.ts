import { Injectable } from '@nestjs/common';
import { firebaseAuth } from './firebase-admin';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(token: string) {
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    return this.userService.findOrCreateUser(decodedToken);
  }

  async sendLoginCode(email: string) {
    const link = await firebaseAuth.generateSignInWithEmailLink(email, {
      url: process.env.FRONTEND_URL as string,
      handleCodeInApp: true,
    });
    return { email, link };
  }

  async createSessionCookie(idToken: string) {
    const expiresIn = 60 * 60 * 1000; // 60 minutes
    const sessionCookie = await firebaseAuth.createSessionCookie(idToken, {
      expiresIn,
    });
    return sessionCookie;
  }

  async verifySessionCookie(sessionCookie: string) {
    return firebaseAuth.verifySessionCookie(sessionCookie, true);
  }
}
