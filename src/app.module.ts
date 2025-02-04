import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MovieController } from './controllers/movie.controller';
import { MovieService } from './services/movie.service';
import { Movie } from './entities/movie.entity';
import { Rating } from './entities/rating.entity';
import { User } from './entities/user.entity';
import { UsersService } from './users/users.service';
import { TmdbClient } from './helpers/tmdb.client';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Movie, Rating, User],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([Movie, Rating, User]),
    AuthModule,
  ],
  controllers: [MovieController],
  providers: [MovieService, TmdbClient, UsersService],
})
export class AppModule {}
