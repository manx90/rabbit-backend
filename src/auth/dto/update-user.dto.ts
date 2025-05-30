import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../common/constants/roles.constant';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
