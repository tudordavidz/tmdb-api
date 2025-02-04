import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from '../services/movie.service';
import { RateMovieDto } from '../dtos/rate-movie.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('movies')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Get()
  async listMovies(@Query('page') page: number, @Query('limit') limit: number) {
    return this.movieService.listMovies(page || 1, limit || 10);
  }

  @Get('search')
  async searchMovies(@Query('query') query: string) {
    return this.movieService.searchMovies(query);
  }

  @Get('filter/:genreId')
  async filterMovies(@Param('genreId') genreId: string) {
    return this.movieService.filterMovies(genreId);
  }

  @Post(':id/rate')
  @UseGuards(JwtAuthGuard) // Protect this endpoint
  async rateMovie(@Param('id') id: number, @Body() dto: RateMovieDto) {
    return this.movieService.rateMovie(id, dto.userId, dto.rating);
  }

  @Get(':id')
  async getMovieDetails(@Param('id') id: number) {
    return this.movieService.getMovieDetails(id);
  }
}
