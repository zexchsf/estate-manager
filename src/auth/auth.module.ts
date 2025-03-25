import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yhskbxbvksugasukvas',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'firebase' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseAuthGuard, JwtStrategy, JwtAuthGuard],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
