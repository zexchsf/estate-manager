import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SocialAuthDto {
  @ApiProperty({
    description: 'ID token received for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...',
  })
  @IsString({ message: 'idToken is required' })
  idToken: string;
}
