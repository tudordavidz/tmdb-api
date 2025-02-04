import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MovieService } from './services/movie.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const movieService = app.get(MovieService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Enable CORS
  app.enableCors();

  await movieService.fetchAndStoreMovies(1); // Fetch movies from page 1
  console.log('Movies fetched and stored successfully!');

  await app.listen(3000, () => {
    console.log('Application is running on: http://localhost:3000');
  });
}

bootstrap();
