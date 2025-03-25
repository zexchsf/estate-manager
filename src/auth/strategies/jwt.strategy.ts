

import { UnauthorizedException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/users.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (_, __, done) =>
        done(null, configService.get<string>('JWT_SECRET')),
    });
  }

  async validate(payload: any): Promise<User> {
    if (!payload?.email) {
      throw new UnauthorizedException('Invalid token payload: Missing email');
    }

    if (!payload.exp || new Date() >= new Date(payload.exp * 1000)) {
      throw new UnauthorizedException('Token has expired');
    }

    const user = await this.usersService.find(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
