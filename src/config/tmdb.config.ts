import { registerAs } from '@nestjs/config';

export default registerAs('tmdb', () => ({
  apiKey: process.env.TMDB_API_KEY,
  baseUrl: 'https://api.themoviedb.org/3',
}));
