import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Auth } from './auth.entity';
import { AuthUser, LoginDto, RegisterDto, ChangePasswordDto } from './auth.dto';
import { AuthRepository } from './auth.repository';

/**
 * Service for handling authentication and user management
 */
@Injectable()
export class AuthService {
  DeleteOne(id: string) {
    throw new Error('Method not implemented.');
  }
  GetAll() {
    throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @param registerDto Registration data
   * @returns The created user and access token
   */
  async signUp(registerDto: RegisterDto) {
    try {
      this.logger.log(`Attempting to register user: ${registerDto.username}`);
      
      // Validate that the user doesn't already exist
      const user = await this.authRepository.findOne(registerDto.username);
      if (user) {
        throw new BadRequestException('User with this username already exists');
      }
      
      // Create the user
      const userCreated = await this.authRepository.save(registerDto as AuthUser);
      
      // Generate authentication token
      const token = this.authRepository.generateToken(userCreated);
      
      // Return user and token
      return {
        access_token: token.access_token,
        user: {
          id: userCreated.id,
          username: userCreated.username,
          role: userCreated.role,
        },
      };
    } catch (error) {
      // Pass through known exceptions
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error(`Error during user registration: ${error.message}`);
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  /**
   * Authenticate a user and generate a JWT token
   * @param login Login credentials
   * @returns Access token for the authenticated user
   */
  async logIn(login: LoginDto): Promise<{ access_token: string; user: Partial<Auth> }> {
    try {
      this.logger.log(`Login attempt for user: ${login.username}`);
      
      // Validate user credentials
      const user = await this.authRepository.validateUser(
        login.username,
        login.password,
      );
      
      if (!user) {
        throw new UnauthorizedException('Invalid username or password');
      }
      
      // Generate JWT token
      const payload = {
        username: user.username,
        sub: String(user.id),
        role: user.role,
      };
      
      const token = this.jwtService.sign(payload);
      
      // Return token and user info
      return {
        access_token: token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error) {
      // Pass through known exceptions
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      this.logger.error(`Error during login: ${error.message}`);
      throw new InternalServerErrorException('Authentication failed');
    }
  }

  /**
   * Get a user by ID
   * @param id User ID
   * @returns The user if found
   */
  async getUser(id: string): Promise<Partial<Auth>> {
    try {
      const user = await this.authRepository.findById(id);
      
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      // Return user without sensitive data
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      // Pass through known exceptions
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(`Error retrieving user: ${error.message}`);
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  /**
   * Check if a user has admin privileges
   * @param authorization Authorization header containing the JWT token
   * @returns Boolean indicating if the user is an admin
   */
  async isAdmin(authorization: string): Promise<boolean> {
    try {
      if (!authorization || !authorization.startsWith('Bearer ')) {
        return false;
      }

      const token = authorization.split(' ')[1];
      if (!token) {
        return false;
      }

      const payload = this.jwtService.verify(token) as { role?: string };
      return payload?.role === 'Admin' || payload?.role === 'SuperAdmin';
    } catch (error: any) {
      this.logger.warn(
        `Invalid token or unauthorized access attempt: ${error.message}`,
      );
      return false;
    }
  }

  /**
   * Delete all users (admin function)
   * @returns Result of the delete operation
   */
  async deleteAll() {
    try {
      this.logger.warn('Deleting all users from the database');
      return await this.authRepository.deleteAll();
    } catch (error: any) {
      this.logger.error(`Error deleting all users: ${error.message}`);
      throw new InternalServerErrorException('Failed to delete all users');
    }
  }

  /**
   * Get a user's role by username
   * @param username The username to look up
   * @returns The user's role if found
   */
  async getRole(username: string): Promise<Auth['role'] | undefined> {
    try {
      const user = await this.authRepository.findOne(username);
      return user?.role;
    } catch (error: any) {
      this.logger.error(`Error retrieving user role: ${error.message}`);
      throw new InternalServerErrorException('Failed to retrieve user role');
    }
  }

  /**
   * Delete a user by username
   * @param username Username of the user to delete
   * @returns Result of the delete operation
   */
  async deleteUser(username: string) {
    try {
      return await this.authRepository.deleteOne(username);
    } catch (error: any) {
      // Pass through known exceptions
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`Error deleting user: ${error.message}`);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  /**
   * Extract user ID from an access token
   * @param accessToken JWT access token
   * @returns The user ID from the token payload
   */
  getUserIdFromToken(accessToken: string): string | null {
    try {
      if (!accessToken) {
        return null;
      }

      // Remove Bearer prefix if present
      const token = accessToken.startsWith('Bearer ')
        ? accessToken.slice(7)
        : accessToken;

      // Decode the token
      const decoded = this.jwtService.decode(token) as { sub?: string };
      return decoded?.sub || null;
    } catch (error: any) {
      this.logger.error(`Error extracting user ID from token: ${error.message}`);
      return null;
    }
  }
  
  /**
   * Change a user's password
   * @param userId User ID
   * @param changePasswordDto Old and new password data
   * @returns Success status
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ success: boolean }> {
    try {
      // Get the user
      const user = await this.authRepository.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Verify old password
      const isPasswordValid = await this.authRepository.validateUser(
        user.username,
        changePasswordDto.oldPassword,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Update password
      await this.authRepository.updatePassword(
        userId,
        changePasswordDto.newPassword,
      );

      return { success: true };
    } catch (error: any) {
      // Pass through known exceptions
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      this.logger.error(`Error changing password: ${error.message}`);
      throw new InternalServerErrorException('Failed to change password');
    }
  }
  
  /**
   * Get all users (admin function)
   * @returns Array of all users
   */
  async getAllUsers(): Promise<Partial<Auth>[]> {
    try {
      const users = await this.authRepository.getAll();
      
      // Return users without sensitive data
      return users.map((user) => ({
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
    } catch (error: any) {
      this.logger.error(`Error retrieving all users: ${error.message}`);
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }
}
