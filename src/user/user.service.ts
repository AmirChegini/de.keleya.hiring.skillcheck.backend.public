import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma.services';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { FindUserDto } from './dto/find-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SortEnum } from 'src/common/enums/sort-by.enum';
import { Constants } from 'src/common/constants/constants';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { DBError } from 'src/common/exception-filters/catch-db-error';
import { GetTokenUserResponseDto } from './dto/get-token-user-response.dto';
import { hashPassword, matchHashedPassword } from 'src/common/utils/password';
import { AuthenticateUserResponseDto } from './dto/authenticate-user-response.dto';
import { ValidateTokenUserResponseDto } from './dto/validate-token-user-response.dto';
import { UserListResponseDto, UserProfileResponseDto, UserSingleResponseDto } from './dto/user.dto';
import { UpdateOwnUserDto } from './dto/update-own-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  /**
   * Finds users with matching fields
   *
   * @param findUserDto
   * @returns UserListResponseDto
   */
  async find(findUserDto: FindUserDto): Promise<UserListResponseDto> {
    const { limit, offset, sortBy, sort, updatedSince, id, name, email, email_confirmed, is_admin, includeDeleted } =
      findUserDto;
    const take = limit ?? Constants.LIMIT;
    const skip = offset ?? Constants.OFFSET;

    const orderBy = {
      [sortBy ?? Constants.SORT_BY]: sort ?? SortEnum.ASC,
    };

    const conditions: any = {};

    if (updatedSince)
      conditions.updated_at = {
        gte: new Date(updatedSince),
      };

    if (id)
      conditions.id = {
        in: id,
      };

    if (name)
      conditions.name = {
        contains: name,
      };

    if (email) conditions.email = email.toLowerCase();
    if (email_confirmed) conditions.email_confirmed = email_confirmed;
    if (is_admin) conditions.is_admin = is_admin;
    if (!includeDeleted) conditions.deleted = false;

    const [users, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        where: conditions,
        take,
        skip,
        orderBy,
      }),
      this.prisma.user.count({ where: conditions }),
    ]);

    return { users, totalCount };
  }

  /**
   * Finds single User by id, name or email
   *
   * @param whereUnique
   * @returns UserSingleResponseDto
   */
  async findUnique(
    whereUnique: Prisma.UserWhereUniqueInput,
    includeCredentials = false,
  ): Promise<UserSingleResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: whereUnique,
      include: includeCredentials ? { credentials: true } : undefined,
    });

    if (!user || !user.email) throw new NotFoundException('User not found.');
    return { user };
  }

  /**
   * Creates a new user with credentials
   *
   * @param createUserDto
   * @returns UserSingleResponseDto
   */
  async create(createUserDto: CreateUserDto): Promise<UserSingleResponseDto> {
    const { name, email, password } = createUserDto;

    const hashedPassword = await hashPassword(password);

    const credential = await this.prisma.credentials
      .create({
        data: {
          hash: hashedPassword,
        },
      })
      .catch((err) => {
        throw DBError(err);
      });

    const user = await this.prisma.user
      .create({
        data: {
          name: name,
          email: email.toLowerCase(),
          credentials: {
            connect: { id: credential.id },
          },
        },
      })
      .catch((err) => {
        throw DBError(err);
      });
    return { user };
  }

  /**
   * Updates a user unless it does not exist or has been marked as deleted before
   *
   * @param updateUserDto
   * @returns UserSingleResponseDto
   */
  async updateOwn(id: number, updateUserDto: UpdateOwnUserDto): Promise<UserSingleResponseDto> {
    const { name, email, password, newPassword } = updateUserDto;
    if (newPassword && !password) throw new BadRequestException('Password is required.');

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: { credentials: true },
    });
    if (!user || !user.email) throw new NotFoundException('User not found.');

    const isPasswordValid = await matchHashedPassword(password, user.credentials.hash);
    if (!isPasswordValid) throw new BadRequestException('Invalid password.');

    const data: any = {};
    if (name) data.name = name;
    if (email) data.email = email.toLocaleLowerCase();

    const updatedUser = await this.prisma.user
      .update({
        where: { id },
        data,
      })
      .catch((err) => {
        throw DBError(err);
      });

    if (newPassword) {
      await this.prisma.credentials
        .update({
          where: { id: user.credentials.id },
          data: {
            hash: await hashPassword(newPassword),
          },
        })
        .catch((err) => {
          throw DBError(err);
        });
    }

    return { user: updatedUser };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserSingleResponseDto> {
    const { name, email, newPassword } = updateUserDto;

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: { credentials: true },
    });
    if (!user || !user.email) throw new NotFoundException('User not found.');

    const data: any = {};
    if (name) data.name = name;
    if (email) data.email = email.toLocaleLowerCase();

    const updatedUser = await this.prisma.user
      .update({
        where: { id },
        data,
      })
      .catch((err) => {
        throw DBError(err);
      });

    if (newPassword) {
      await this.prisma.credentials
        .update({
          where: { id: user.credentials.id },
          data: {
            hash: await hashPassword(newPassword),
          },
        })
        .catch((err) => {
          throw DBError(err);
        });
    }

    return { user: updatedUser };
  }

  /**
   * Deletes a user
   * Function does not actually remove the user from database but instead marks them as deleted by:
   * - removing the corresponding `credentials` row from your db
   * - changing the name to DELETED_USER_NAME constant (default: `(deleted)`)
   * - setting email to NULL
   * - setting deleted to true
   *
   * @param deleteUserDto
   * @returns null, only status code 200 is enough
   */
  async delete(id: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        credentials: true,
      },
    });
    if (!user || !user.email) throw new NotFoundException('User not found.');

    await this.prisma.credentials
      .delete({
        where: {
          id: user.credentials.id,
        },
      })
      .catch((err) => {
        throw DBError(err);
      });

    await this.prisma.user
      .update({
        where: {
          id,
        },
        data: {
          name: 'DELETED_USER_NAME',
          email: null,
          deleted: true,
        },
      })
      .catch((err) => {
        throw DBError(err);
      });
  }

  /**
   * Authenticates a user and returns a JWT token
   *
   * @param authenticateUserDto email and password for authentication
   * @returns a JWT token
   */

  async authenticateAndGetJwtToken(authenticateUserDto: AuthenticateUserDto): Promise<GetTokenUserResponseDto> {
    const { email, password } = authenticateUserDto;

    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { credentials: true },
    });

    if (!user || !user.email) {
      throw new UnauthorizedException('Invalid Credentials.');
    }

    const isPasswordValid = await matchHashedPassword(password, user.credentials.hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials.');
    }

    const token = await this.generateAccessToken(user);

    return { token };
  }

  /**
   * Authenticates a user
   *
   * @param authenticateUserDto email and password for authentication
   * @returns true or false
   */

  async authenticate(authenticateUserDto: AuthenticateUserDto): Promise<AuthenticateUserResponseDto> {
    let credentials = true;

    const { email, password } = authenticateUserDto;

    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { credentials: true },
    });

    if (!user || !user.email) {
      credentials = false;
      return { credentials };
    }

    const isPasswordValid = await matchHashedPassword(password, user.credentials.hash);

    if (!isPasswordValid) {
      credentials = false;
    }

    return { credentials };
  }

  /**
   * Validates a JWT token
   *
   * @param token a JWT token
   * @returns the decoded token if valid
   */
  async validateToken(req): Promise<ValidateTokenUserResponseDto> {
    return this.tokenDecoder(req);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { credentials: true },
    });

    if (!user || !user.email) {
      return null;
    }

    const isPasswordValid = await matchHashedPassword(password, user.credentials.hash);

    if (!isPasswordValid) {
      return null;
    }
    const { credentials, credentials_id, ...result } = user;

    return result;
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = {
      id: user.id,
      isAdmin: user.is_admin,
    };

    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async login(user: any): Promise<{ token: string }> {
    if (!user) throw new UnauthorizedException('user service login');
    const token = await this.generateAccessToken(user);
    return { token };
  }

  async getProfile(req): Promise<UserProfileResponseDto> {
    const { decodedToken } = await this.tokenDecoder(req);
    const { user } = await this.findUnique({ id: decodedToken.id });
    return { user };
  }

  async tokenDecoder(req): Promise<ValidateTokenUserResponseDto> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException();
      }
      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256'],
      });

      return {
        decodedToken: {
          id: decodedToken.id,
          isAdmin: decodedToken.isAdmin,
        },
      };
    } catch (err) {
      throw new UnauthorizedException('Token is not valid.');
    }
  }
}
