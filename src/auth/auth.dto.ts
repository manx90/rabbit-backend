import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

/**
 * Data transfer object for user login
 */
export class LoginDto {
  /**
   * Username for authentication
   */
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  /**
   * Password for authentication
   */
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}

/**
 * Data transfer object for user registration
 */
export class RegisterDto {
  /**
   * Username for the new account
   */
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username cannot exceed 20 characters' })
  username: string;

  /**
   * Password for the new account
   */
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  password: string;

  /**
   * Role for the new account (optional)
   */
  @IsOptional()
  @IsString({ message: 'Role must be a string' })
  role?: 'SuperAdmin' | 'Admin' | 'SalerMan';
}

/**
 * Data transfer object for changing password
 */
export class ChangePasswordDto {
  /**
   * Current password for verification
   */
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString({ message: 'Current password must be a string' })
  oldPassword: string;

  /**
   * New password to set
   */
  @IsNotEmpty({ message: 'New password is required' })
  @IsString({ message: 'New password must be a string' })
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'New password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  newPassword: string;
}

/**
 * User data transfer object for internal use
 */
export class AuthUser {
  /**
   * Username for the user
   */
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  username: string;
  
  /**
   * Password for the user
   */
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
  
  /**
   * Role for authorization
   */
  @IsOptional()
  @IsString({ message: 'Role must be a string' })
  role?: 'SuperAdmin' | 'Admin' | 'SalerMan';
  
  /**
   * User ID
   */
  @IsOptional()
  @IsString({ message: 'ID must be a string' })
  id?: string;
}
