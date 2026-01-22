import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCuisineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  image_url?: string;
}
