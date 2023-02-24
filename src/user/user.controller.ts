import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  HttpCode,
  UseGuards,
  NotImplementedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { FindUserDto } from './dto/find-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async find(@Query() findUserDto: FindUserDto, @Req() req: Request) {
    return this.usersService.find(findUserDto);
  }

  @Get(':id')
  async findUnique(@Param('id', ParseIntPipe) id, @Req() req: Request) {
    return this.usersService.findUnique({ id });
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id, @Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id, @Req() req: Request) {
    return this.usersService.delete(id);
  }

  @Post('validate')
  async userValidateToken(@Req() req: Request) {
    throw new NotImplementedException();
  }

  @Post('authenticate')
  @HttpCode(200)
  async userAuthenticate(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.usersService.authenticate(authenticateUserDto);
  }

  @Post('token')
  async userGetToken(@Body() authenticateUserDto: AuthenticateUserDto) {
    throw new NotImplementedException();
  }
}
