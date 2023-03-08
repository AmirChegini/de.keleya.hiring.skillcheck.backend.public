import {
  Get,
  Req,
  Body,
  Post,
  Param,
  Patch,
  Query,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import {
  UserDto,
  UserProfileDto,
  UserOwnUserIdDto,
  UserListResponseDto,
  UserSingleResponseDto,
  UserProfileResponseDto,
  UserOwnUserIdResponseDto,
} from './dto/user.dto';
import { UserService } from './user.service';
import { FindUserDto } from './dto/find-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/common/guards/role.guard';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { GetTokenUserResponseDto } from './dto/get-token-user-response.dto';
import { AuthenticateUserResponseDto } from './dto/authenticate-user-response.dto';
import { ValidateTokenUserResponseDto } from './dto/validate-token-user-response.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard('jwt'))
  @Serialize(UserProfileDto)
  async getProfile(@Req() req: Request): Promise<UserProfileResponseDto> {
    return this.usersService.getProfile(req.user);
  }

  @Get('ownUserId')
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard('jwt'))
  @Serialize(UserOwnUserIdDto)
  async getOwnUserId(@Req() req: Request): Promise<UserOwnUserIdResponseDto> {
    return this.usersService.getProfile(req.user);
  }

  @Patch('updateOwn')
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse()
  @Serialize(UserProfileDto)
  async updateOwn(@Body() updateUserDto: UpdateUserDto, @Req() req: Request): Promise<UserProfileResponseDto> {
    const { user } = await this.usersService.getProfile(req);
    return this.usersService.update(user.id, updateUserDto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(UserDto)
  async find(@Query() findUserDto: FindUserDto): Promise<UserListResponseDto> {
    return this.usersService.find(findUserDto);
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(UserDto)
  async findUnique(@Param('id', ParseIntPipe) id: number): Promise<UserSingleResponseDto> {
    return this.usersService.findUnique({ id });
  }

  @Post()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(UserDto)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserSingleResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(UserDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserSingleResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.delete(id);
  }

  @Post('validate')
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard('jwt'))
  async userValidateToken(@Req() req: Request): Promise<ValidateTokenUserResponseDto> {
    return {
      decodedToken: {
        id: req.user['id'],
        isAdmin: req.user['isAdmin'],
      },
    };
  }

  @Post('authenticate')
  @HttpCode(200)
  async userAuthenticate(@Body() authenticateUserDto: AuthenticateUserDto): Promise<AuthenticateUserResponseDto> {
    return this.usersService.authenticate(authenticateUserDto);
  }

  @Post('token')
  @HttpCode(200)
  @ApiUnauthorizedResponse()
  async userGetToken(@Body() authenticateUserDto: AuthenticateUserDto): Promise<GetTokenUserResponseDto> {
    return this.usersService.authenticateAndGetJwtToken(authenticateUserDto);
  }

  /**
   * User login
   * This rout uses local strategy
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request) {
    return this.usersService.login(req.user);
  }
}
