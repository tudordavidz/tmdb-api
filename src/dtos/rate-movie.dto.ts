import { IsString, IsNumber, Min, Max } from 'class-validator';

export class RateMovieDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number; // Rating value (1-5)
}
