import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class EmailPasswordLoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  password: string;
}
