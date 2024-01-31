import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { User, UserRepository } from './models';
import {
  CreateUserDto,
  GetUserDto,
  UpdateUserDto,
  ValidateUserDto,
} from './dto';
import { UserRoles, UserStatuses } from 'src/common';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createUserData = {
      ...createUserDto,
      password: await hash(createUserDto.password, 10),
      role: createUserDto.role || UserRoles.CUSTOMER,
      status: createUserDto.status || UserStatuses.PENDING,
    };
    return this.userRepository.create(createUserData);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(where: GetUserDto): Promise<User> {
    if (Object.keys(where).length === 0) {
      throw new BadRequestException(`User filter options aren't specified!`);
    }
    return this.userRepository.findOne(where);
  }

  async update(where: GetUserDto, updateUserDto: UpdateUserDto): Promise<User> {
    const updateUserData = { ...updateUserDto };
    if (updateUserData.password) {
      updateUserData.password = await hash(updateUserData.password, 10);
    }
    return this.userRepository.updateOne(where, updateUserData);
  }

  delete(where: GetUserDto): Promise<User> {
    return this.userRepository.deleteOne(where);
  }

  async validate({ email, password }: ValidateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }
}
