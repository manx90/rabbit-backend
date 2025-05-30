import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/constants/roles.constant';

/** Data transfer object for user login */
export class LoginDto {
  @ApiProperty({
    example: 'newuser',
    description: 'Username for authentication',
  })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @ApiProperty({ example: 'StrongP@ss1', description: 'User password' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}

/** Data transfer object for user registration */
export class RegisterDto {
  @ApiProperty({ example: 'newuser', description: 'Desired username' })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username cannot exceed 20 characters' })
  username: string;

  @ApiProperty({ example: 'StrongP@ss1', description: 'Desired password' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  password: string;

  @ApiProperty({
    enum: Role,
    enumName: 'Role',
    example: Role.Admin,
    description: 'Optional user role',
    required: false,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be a valid enum value' })
  role?: Role;
}

/** Data transfer object for changing password */
export class ChangePasswordDto {
  @ApiProperty({ example: 'OldP@ss1', description: 'Current password' })
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString({ message: 'Current password must be a string' })
  oldPassword: string;

  @ApiProperty({ example: 'NewP@ss2', description: 'New password' })
  @IsNotEmpty({ message: 'New password is required' })
  @IsString({ message: 'New password must be a string' })
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'New password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  newPassword: string;
}

/** Internal user data transfer object */
export class AuthUser {
  @ApiProperty({ example: 'admin', description: 'Username' })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @ApiProperty({ example: 'StrongP@ss1', description: 'Password' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  @ApiProperty({
    enum: Role,
    enumName: 'Role',
    example: Role.Admin,
    description: 'User role',
    required: false,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be a valid enum value' })
  role?: Role;

  @ApiProperty({ example: '1', description: 'User ID', required: false })
  @IsOptional()
  @IsString({ message: 'ID must be a string' })
  id?: string;
}
