import { Module } from '@nestjs/common';
import { EstatesController } from './estates.controller';
import { EstatesService } from './estates.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Estate, EstateSchema } from './estates.schema';
import { EstatesRepository } from './estates.repository';
import { User, UserSchema } from 'src/users/users.schema';
import { UsersController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';
import { HybridAuthGuard } from 'src/auth/guards/hybrid-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Estate.name, schema: EstateSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UsersModule,
  ],
  controllers: [EstatesController],
  providers: [EstatesService, EstatesRepository, HybridAuthGuard],
  exports: [EstatesService],
})
export class EstatesModule {}
