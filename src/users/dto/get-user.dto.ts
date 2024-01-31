import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserStatuses } from 'src/common';

export class GetUserDto {
  @IsOptional()
  _id?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserStatuses)
  status?: UserStatuses;
}
