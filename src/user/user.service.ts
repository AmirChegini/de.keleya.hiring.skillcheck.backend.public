import { JwtService } from '@nestjs/jwt';
import { Prisma, User, Credentials } from '@prisma/client';
import { PrismaService } from '../prisma.services';
import { ConflictException, Injectable, InternalServerErrorException, NotImplementedException } from '@nestjs/common';

import { FindUserDto } from './dto/find-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { SortEnum } from 'src/common/enums/sort-by.enum';
import { Constants } from 'src/common/constants/constants';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { hashPassword } from 'src/common/utils/password';
import { BadRequestException } from '@nestjs/common/exceptions';

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
      const take = Number(limit ?? Constants.LIMIT);
      const skip = Number(offset ?? Constants.OFFSET);

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
    } catch (error) {
      console.log(error);
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
    throw new NotImplementedException();
  }

  /**
   * Creates a new user with credentials
   *
   * @param createUserDto
   * @returns result of create
   */
  async create(createUserDto: CreateUserDto) :Promise<User>{
    const { name, email, password } = createUserDto;
    // Check if a user with the same email already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password using bcryptjs
    const hashedPassword =await hashPassword(createUserDto.password);

    // Create a new credential record in the database with the hashed password
    const credential = await this.prisma.credentials.create({
      data: {
        hash: hashedPassword,
      },
    });

    // Create a new user record in the database and associate it with the new credential record
    const user = await this.prisma.user.create({
      data: {
        name: name,
        email: email,
        credentials: {
          connect: { id: credential.id },
        },
      },
    }).catch((err) => {
      console.log(err)
      throw new BadRequestException(err)
    })
    return user
  }

  /**
   * Updates a user unless it does not exist or has been marked as deleted before
   *
   * @param updateUserDto
   * @returns result of update
   */
  async update(updateUserDto: UpdateUserDto) {
    throw new NotImplementedException();
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
  async delete(deleteUserDto: DeleteUserDto) {
    throw new NotImplementedException();
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
    throw new NotImplementedException();
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
