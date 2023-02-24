import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.services';
import { Prisma, User } from '@prisma/client';
import { NotFoundException, UnauthorizedException } from '@nestjs/common/exceptions';
import { Injectable, InternalServerErrorException, NotImplementedException } from '@nestjs/common';

import { FindUserDto } from './dto/find-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SortEnum } from 'src/common/enums/sort-by.enum';
import { hashPassword, matchHashedPassword } from 'src/common/utils/password';
import { Constants } from 'src/common/constants/constants';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { DBError } from 'src/common/exception-filters/catch-db-error';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  /**
   * Finds users with matching fields
   *
   * @param findUserDto
   * @returns User[]
   */
  async find(findUserDto: FindUserDto): Promise<{ users: User[]; totalCount: number }> {
    const { limit, offset, sortBy, sort, updatedSince, id, name, credentials, email, email_confirmed, is_admin } =
      findUserDto;
    try {
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

      if (credentials) conditions.credentials = { id: credentials };
      if (email) conditions.email = email.toLowerCase();
      if (email_confirmed) conditions.email_confirmed = email_confirmed;
      if (is_admin) conditions.is_admin = is_admin;

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
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Finds single User by id, name or email
   *
   * @param whereUnique
   * @returns User
   */
  async findUnique(whereUnique: Prisma.UserWhereUniqueInput, includeCredentials = false) {
    const user = await this.prisma.user.findUnique({
      where: whereUnique,
      include: includeCredentials ? { credentials: true } : undefined,
    });

    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  /**
   * Creates a new user with credentials
   *
   * @param createUserDto
   * @returns result of create
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
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
    return user;
  }

  /**
   * Updates a user unless it does not exist or has been marked as deleted before
   *
   * @param updateUserDto
   * @returns result of update
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user
      .update({
        where: { id },
        data: { name: updateUserDto.name },
      })
      .catch((err) => {
        throw DBError(err);
      });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Deletes a user
   * Function does not actually remove the user from database but instead marks them as deleted by:
   * - removing the corresponding `credentials` row from your db
   * - changing the name to DELETED_USER_NAME constant (default: `(deleted)`)
   * - setting email to NULL
   *
   * @param deleteUserDto
   * @returns results of users and credentials table modification
   */
  async delete(id: number) {
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
  async authenticateAndGetJwtToken(authenticateUserDto: AuthenticateUserDto) {
    throw new NotImplementedException();
  }

  /**
   * Authenticates a user
   *
   * @param authenticateUserDto email and password for authentication
   * @returns true or false
   */
  async authenticate(authenticateUserDto: AuthenticateUserDto) {
    let credentials = true;

    const { email, password } = authenticateUserDto;

    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { credentials: true },
    });

    if (!user) {
      credentials = false;
      return { credentials }
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
  async validateToken(token: string) {
    throw new NotImplementedException();
  }
}
