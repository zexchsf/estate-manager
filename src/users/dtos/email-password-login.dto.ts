import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class EmailPasswordLoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    example: 'secure_password001',
    description: 'User password (6-20 characters)',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  password: string;
}
