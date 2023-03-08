import { Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { PrismaService } from '../prisma.services';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';


describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'JWT_SECRET',
          signOptions: {
            expiresIn: '1year',
            algorithm: 'HS256',
          },
        }),
      ],
      providers: [UserService, PrismaService, JwtStrategy, ConfigService],
    }).compile();
    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });


  describe('create', () => {
    it('should create a new user', async () => {
      const newUser: CreateUserDto = {
        name: 'test',
        email: 'test@example.com',
        password: 'testpassword',
      };
      jest.spyOn(userService, 'create').mockResolvedValueOnce({
        id: 1,
        email_confirmed: false,
        is_admin: false,
        created_at:new Date(),
        updated_at: new Date(),
        name: 'test',
        email: 'test@example.com',
        credentials_id:1
      });
      const result = await userController.create(newUser);
      expect(result).toEqual({ id: 1, ...newUser });
    });
  });

  describe('update', () => {
    let req:any
    it('should update an existing user', async () => {
      const updateUser: UpdateUserDto = {
        name: 'updated name',
      };
      jest.spyOn(userService, 'update').mockResolvedValueOnce({
        id: 1,
        email_confirmed: false,
        is_admin: false,
        created_at:new Date(),
        updated_at: new Date(),
        name: 'updated name',
        email: 'test@example.com',
        credentials_id:1
      });
      const result = await userController.update(1, updateUser,req);
      expect(result).toEqual({
        id: 1,
        email: 'updatedtest@example.com',
        password: 'testpassword',
      });
    });
  });

  // describe('delete', () => {
  //   it('should delete an existing user', async () => {
  //     jest.spyOn(userService, 'delete').mockResolvedValueOnce(1);
  //     const result = await userController.delete(1);
  //     expect(result).toEqual({ id: 1 });
  //   });
  // });

  // describe('getProfile', () => {
  //   it('should retrieve the user profile', async () => {
  //     const user = {
  //       id: 1,
  //       email: 'test@example.com',
  //       password: 'testpassword',
  //     };
  //     const currentUser = jest.fn(() => user);
  //     const result = await userController.getProfile(currentUser);
  //     expect(result).toEqual(user);
  //   });
  // });

});
