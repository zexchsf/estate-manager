import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { firebaseAuth } from '../firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No Firebase token found');
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      req.user = await firebaseAuth.verifyIdToken(token);
      return true; // Token is valid, continue request
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}
