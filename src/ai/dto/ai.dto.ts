import { IsString, IsNotEmpty } from 'class-validator';

export class AiQueryDto {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;
}
