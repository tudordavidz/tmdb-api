import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from '../services/movie.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RateMovieDto } from '../dtos/rate-movie.dto';

describe('MovieController', () => {
  let controller: MovieController;
  let service: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: {
            listMovies: jest.fn(),
            searchMovies: jest.fn(),
            filterMovies: jest.fn(),
            rateMovie: jest.fn(),
            getMovieDetails: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listMovies', () => {
    it('should call movieService.listMovies with default values', async () => {
      await controller.listMovies(1, 10);
      expect(service.listMovies).toHaveBeenCalledWith(1, 10);
    });

    it('should call movieService.listMovies with provided values', async () => {
      await controller.listMovies(2, 5);
      expect(service.listMovies).toHaveBeenCalledWith(2, 5);
    });
  });

  describe('searchMovies', () => {
    it('should call movieService.searchMovies with query', async () => {
      const query = 'test';
      await controller.searchMovies(query);
      expect(service.searchMovies).toHaveBeenCalledWith(query);
    });
  });

  describe('filterMovies', () => {
    it('should call movieService.filterMovies with genreId', async () => {
      const genreId = '1';
      await controller.filterMovies(genreId);
      expect(service.filterMovies).toHaveBeenCalledWith(genreId);
    });
  });

  describe('rateMovie', () => {
    it('should call movieService.rateMovie with id and dto', async () => {
      const id = 1;
      const dto: RateMovieDto = { userId: '1', rating: 5 };
      await controller.rateMovie(id, dto);
      expect(service.rateMovie).toHaveBeenCalledWith(
        id,
        dto.userId,
        dto.rating,
      );
    });
  });

  describe('getMovieDetails', () => {
    it('should call movieService.getMovieDetails with id', async () => {
      const id = 1;
      await controller.getMovieDetails(id);
      expect(service.getMovieDetails).toHaveBeenCalledWith(id);
    });
  });
});
