import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, FirebaseAuthStrategy],
})
export class AuthModule {}
