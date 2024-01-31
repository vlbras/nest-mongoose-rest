import { UsersService } from './users.service';
import { User } from './models';
import { CreateUserDto, UpdateUserDto } from './dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IsObjectIdPipe } from 'nestjs-object-id';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async user(@Param('id', IsObjectIdPipe) _id: string): Promise<User> {
    return this.usersService.findOne({ _id });
  }

  @Patch(':id')
  async updateUser(
    @Param('id', IsObjectIdPipe) _id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update({ _id }, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', IsObjectIdPipe) _id: string): Promise<User> {
    return this.usersService.delete({ _id });
  }
}
