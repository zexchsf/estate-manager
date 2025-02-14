import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { FirebaseStrategy } from './firebase-auth.strategy';
import { UsersModule } from 'src/users/users.module';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'firebase' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseStrategy, FirebaseAuthGuard],
  exports: [PassportModule],
})
export class AuthModule {}
