import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsStrongPassword } from 'class-validator';
import { UserRoles, UserStatuses } from 'src/common';

export class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles;

  @IsOptional()
  @IsEnum(UserStatuses)
  status?: UserStatuses;
}
