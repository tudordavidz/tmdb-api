import { IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
