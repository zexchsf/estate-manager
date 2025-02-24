import { IsString } from 'class-validator';

export class SocialAuthDto {
  @IsString({ message: 'idToken is required' })
  idToken: string;
}
