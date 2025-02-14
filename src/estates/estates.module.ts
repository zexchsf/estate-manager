import { Module } from '@nestjs/common';
import { EstatesController } from './estates.controller';
import { EstatesService } from './estates.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Estate, EstateSchema } from './estates.schema';
import { EstatesRepository } from './estates.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Estate.name, schema: EstateSchema }]),
  ],
  controllers: [EstatesController],
  providers: [EstatesService, EstatesRepository],
  exports: [EstatesService],
})
export class EstatesModule {}
