import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

interface TmdbMovieResponse {
  results: any[];
}

interface TmdbGenreResponse {
  genres: any[];
}

@Injectable()
export class TmdbClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    const apiKey = configService.get<string>('TMDB_API_KEY');
    if (!apiKey) {
      throw new Error('TMDB_API_KEY is not set in the .env file.');
    }
    this.apiKey = apiKey;

    this.baseUrl =
      configService.get<string>('TMDB_BASEURL') ||
      'https://api.themoviedb.org/3';

    console.log('TMDB_API_KEY:', this.apiKey);
  }

  async getMovies(page: number): Promise<any[]> {
    try {
      const response = await axios.get<TmdbMovieResponse>(
        `${this.baseUrl}/movie/popular`,
        {
          params: { api_key: this.apiKey, page },
        },
      );

      console.log('Axios Request URL:', `${this.baseUrl}/movie/popular`);
      console.log('Axios Request Params:', { api_key: this.apiKey, page });

      return response.data.results;
    } catch (error) {
      console.error(
        'Error fetching movies from TMDB:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async getGenres(): Promise<TmdbGenreResponse['genres']> {
    const response = await axios.get<TmdbGenreResponse>(
      `${this.baseUrl}/genre/movie/list`,
      {
        params: { api_key: this.apiKey },
      },
    );
    return response.data.genres;
  }
}
