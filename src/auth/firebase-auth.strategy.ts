import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  async validate(req: Request): Promise<any> {
    const token = req.headers['authorization']?.split(' ')[1]; // ✅ Extract Bearer token
    console.log('Extracted Token:', token);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('Decoded Token:', decodedToken);
      return decodedToken;
    } catch (error) {
      console.error('Firebase Auth Error:', error);
      throw new UnauthorizedException('Invalid Firebase Token');
    }
  }
}
