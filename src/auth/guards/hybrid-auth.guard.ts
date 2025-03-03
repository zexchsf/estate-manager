import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { firebaseAuth } from '../firebase-admin';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class HybridAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token found');
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      let decodedUser;

      try {
        decodedUser = await firebaseAuth.verifyIdToken(token);
        console.log('Firebase token verified:', decodedUser);
      } catch (firebaseError) {
        console.log('Not a Firebase token, trying JWT...');
      }

      // If Firebase verification failed, try as JWT
      if (!decodedUser) {
        const JWT_SECRET = process.env.JWT_SECRET || 'yhskbxbvksugasukvas';
        decodedUser = jwt.verify(token, JWT_SECRET);
        console.log('JWT token verified:', decodedUser);
      }

      req.user = decodedUser;
      return true;
    } catch (error) {
      console.log('Auth Error:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
