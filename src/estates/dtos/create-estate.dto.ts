import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateEstateDto {
  @ApiProperty({ example: 'Unity Estate', description: 'Name of the estate' })
  @IsString()
  name: string;

  @ApiProperty({ example: '12345', description: 'Owner ID of the estate' })
  @IsNotEmpty()
  @IsMongoId()
  ownerId: Types.ObjectId;
}
