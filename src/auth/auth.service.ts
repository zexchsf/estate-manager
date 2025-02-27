import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { firebaseAuth } from './firebase-admin';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const existingUser = await this.userService.find(email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await this.userService.create({
      uid: new mongoose.Types.ObjectId().toHexString(),
      email,
      password: hashedPassword,
    });
    const token = this.jwtService.sign({ email: user.email, id: user.uid });
    return { user, token };
  }

  async signin(email: string, password: string) {
    const user = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }
    const token = this.jwtService.sign({ email: user.email, id: user.uid });
    return { user, token };
  }

  async verifyFirebaseToken(idToken: string) {
    try {
      // Verify Firebase token
      const decodedToken = await firebaseAuth.verifyIdToken(idToken);
      // Find or create user
      return await this.userService.findOrCreateUser(decodedToken);
    } catch (error) {
      throw new HttpException(
        'Invalid or expired Firebase ID token',
        HttpStatus.UNAUTHORIZED,
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
