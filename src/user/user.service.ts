import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma.services';
import { Injectable, InternalServerErrorException, NotImplementedException } from '@nestjs/common';

import { FindUserDto } from './dto/find-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { SortEnum } from 'src/common/enums/sort.enum';
import { Constants } from 'src/common/constants/constants';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  /**
   * Finds users with matching fields
   *
   * @param findUserDto
   * @returns User[]
   */
  async find(findUserDto: FindUserDto)
    // : Promise<{ users: User[], totalCount: number }>
  {
    console.log({findUserDto})
    try{
    const limit = Number(findUserDto.limit ?? Constants.LIMIT);
    const offset = Number(findUserDto.offset ?? Constants.OFFSET);
    const sortBy = findUserDto.sortBy ?? Constants.SORT_BY;
    const sort = findUserDto.sort ?? SortEnum.ASC;

    const orderBy = {
      [sortBy]: sort,
    };

    const conditions: any = {};

    if (findUserDto.updatedSince)
      conditions.updated_at = {
        gte: new Date(findUserDto.updatedSince),
      };

    if (findUserDto.id)
      conditions.id = {
        in: findUserDto.id,
      };

    if (findUserDto.name)
      conditions.name = {
        contains: findUserDto.name,
      };

    if (findUserDto.credentials) conditions.credentials = { id: findUserDto.credentials };

    if (findUserDto.email)
      conditions.email = findUserDto.email.toLowerCase()


    if (findUserDto.email_confirmed) conditions.email_confirmed = findUserDto.email_confirmed;

    if (findUserDto.is_admin) conditions.is_admin = findUserDto.is_admin;

    const [users, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        where: conditions,
        take: limit,
        skip: offset,
        orderBy,
        select: {
          id: true,
          name: true,
          email: true,
          email_confirmed: true,
          is_admin: true,
          created_at: true,
          updated_at: true,
          credentials: {
            select: {
              id: true,
              hash: true,
            },
          },
        }
      }),
      this.prisma.user.count({ where: conditions}),
    ]);

    
    // console.log(users, totalCount);
      return { users, totalCount }
      
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
  async create(createUserDto: CreateUserDto) {
    throw new NotImplementedException();
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
