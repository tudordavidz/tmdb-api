import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should throw an error if username or password is missing', async () => {
      await expect(
        authController.register({ username: '', password: '' }),
      ).rejects.toThrow(
        new HttpException(
          'Username and password are required',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should call authService.register with correct parameters', async () => {
      const registerSpy = jest
        .spyOn(authService, 'register')
        .mockResolvedValue({ access_token: 'result' });
      const result = await authController.register({
        username: 'test',
        password: 'test',
      });
      expect(registerSpy).toHaveBeenCalledWith('test', 'test');
      expect(result).toEqual({ access_token: 'result' });
    });
  });

  describe('login', () => {
    it('should throw an error if username or password is missing', async () => {
      await expect(
        authController.login({ username: '', password: '' }),
      ).rejects.toThrow(
        new HttpException(
          'Username and password are required',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should call authService.login with correct parameters', async () => {
      const loginSpy = jest
        .spyOn(authService, 'login')
        .mockResolvedValue({ access_token: 'result' });
      const result = await authController.login({
        username: 'test',
        password: 'test',
      });
      expect(loginSpy).toHaveBeenCalledWith({
        username: 'test',
        password: 'test',
      });
      expect(result).toEqual({ access_token: 'result' });
    });
  });
});
