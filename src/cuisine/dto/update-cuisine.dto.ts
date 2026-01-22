import { IsString, IsOptional } from 'class-validator';

export class UpdateCuisineDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  image_url?: string;
}
