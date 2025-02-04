import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { Rating } from '../entities/rating.entity';
import { TmdbClient } from '../helpers/tmdb.client';
import { ConfigService } from '@nestjs/config';
import { In } from 'typeorm';
import { ILike } from 'typeorm';
import { Raw } from 'typeorm';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    private tmdbClient: TmdbClient,
    private configService: ConfigService,
  ) {}

  async fetchAndStoreMovies(page: number) {
    const movies = await this.tmdbClient.getMovies(page);
    const savedMovies = movies.map((movie) => ({
      title: movie.title,
      overview: movie.overview,
      releaseDate: new Date(movie.release_date),
      genres: movie.genre_ids.map((id) => id.toString()),
    }));
    await this.movieRepository.save(savedMovies);
  }

  async listMovies(page: number, limit: number) {
    const [movies, total] = await this.movieRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { movies, total };
  }

  async searchMovies(query: string): Promise<Movie[]> {
    return this.movieRepository.find({
      where: [
        { title: ILike(`%${query}%`) },
        { overview: ILike(`%${query}%`) },
      ],
    });
  }

  async filterMovies(genreId: string): Promise<Movie[]> {
    const parsedGenreId = parseInt(genreId, 10);
    if (isNaN(parsedGenreId)) {
      throw new Error('Invalid genre ID');
    }
    return this.movieRepository
      .createQueryBuilder('movie')
      .where(`movie.genres::jsonb @> '\"${parsedGenreId}\"'`)
      .getMany();
  }

  /**
   * Rate a movie.
   * @param movieId - The ID of the movie to rate.
   * @param userId - The ID of the user rating the movie.
   * @param ratingValue - The rating value (1-5).
   */
  async rateMovie(
    movieId: number,
    userId: string,
    ratingValue: number,
  ): Promise<{ message: string }> {
    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
    });

    if (!movie) {
      throw new Error('Movie not found');
    }

    if (ratingValue < 1 || ratingValue > 5) {
      throw new Error('Invalid rating value. Must be between 1 and 5.');
    }

    // Check if the user has already rated the movie
    const existingRating = await this.ratingRepository.findOne({
      where: { movieId, userId },
    });

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = ratingValue;
      await this.ratingRepository.save(existingRating);
    } else {
      // Create a new rating
      const newRating = new Rating();
      newRating.userId = userId;
      newRating.movieId = movieId;
      newRating.rating = ratingValue;
      await this.ratingRepository.save(newRating);
    }

    return { message: 'Rating submitted successfully' };
  }

  /**
   * Get details of a specific movie, including average rating.
   * @param movieId - The ID of the movie to retrieve.
   */
  async getMovieDetails(movieId: number): Promise<any> {
    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
      relations: ['ratings'], // Include ratings in the query
    });

    if (!movie) {
      throw new Error('Movie not found');
    }

    const averageRating =
      movie.ratings.length > 0
        ? movie.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
          movie.ratings.length
        : 0;

    return {
      ...movie,
      averageRating: parseFloat(averageRating.toFixed(2)),
    };
  }

  /**
   * Calculate the average rating for a movie.
   * @param movieId - The ID of the movie.
   */
  async getAverageRating(movieId: number): Promise<number> {
    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
      relations: ['ratings'],
    });

    if (!movie || !movie.ratings.length) return 0;

    const totalRatings = movie.ratings.reduce(
      (sum, rating) => sum + rating.rating,
      0,
    );
    return totalRatings / movie.ratings.length;
  }
}
