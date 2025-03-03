import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddResidentDto {
  @ApiProperty({ example: '67890', description: 'User ID of the resident' })
  @IsString()
  userId: string;
}
