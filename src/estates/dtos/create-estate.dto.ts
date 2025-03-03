import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateEstateDto {
  @ApiProperty({ example: 'Unity Estate', description: 'Name of the estate' })
  @IsString()
  name: string;

  @ApiProperty({ example: '12345', description: 'Owner ID of the estate' })
  @IsString()
  ownerId: string;
}
