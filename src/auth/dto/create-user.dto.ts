import { IsString, IsEnum, MinLength } from 'class-validator';
import { Role } from '../../common/constants/roles.constant';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}
