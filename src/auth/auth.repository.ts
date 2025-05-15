/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Auth } from './auth.entity';
import { AuthUser } from './auth.dto';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

/**
 * Repository for handling authentication-related database operations
 */
@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  /**
   * Find a user by username
   * @param username The username to search for
   * @returns The user if found, null otherwise
   */
  async findOne(username: string): Promise<Auth | null> {
    try {
      return await this.authRepository.findOne({ where: { username } });
    } catch (error) {
      this.logger.error(
        `Error finding user by username: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error finding user');
    }
  }

  /**
   * Find a user by ID
   * @param id The user ID to search for
   * @returns The user if found, null otherwise
   */
  async findById(id: string): Promise<Auth | null> {
    try {
      return await this.authRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Error finding user by ID: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error finding user');
    }
  }

  /**
   * Save a new user to the database
   * @param user The user data to save
   * @returns The created user
   */
  async save(user: AuthUser): Promise<Auth> {
    try {
      // Check if user already exists
      const existingUser = await this.findOne(user.username);
      if (existingUser) {
        throw new ConflictException('User with this username already exists');
      }

      // Get salt rounds from environment variables
      const saltRounds = process.env.SALT || '10';
      this.logger.debug(`Using salt rounds: ${saltRounds}`);

      // Hash the password
      const hashedPassword = await bcrypt.hash(
        user.password,
        Number(saltRounds),
      );

      // Create the user entity
      const userToSave = this.authRepository.create({
        username: user.username,
        password: hashedPassword,
        role: user.role || 'SalerMan',
      });

      // Save the user to the database
      return await this.authRepository.save(userToSave);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error saving user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create user account');
    }
  }

  /**
   * Validate a user's credentials
   * @param username The username to validate
   * @param password The password to validate
   * @returns The authenticated user if credentials are valid, null otherwise
   */
  async validateUser(username: string, password: string): Promise<Auth | null> {
    try {
      // Find the user by username
      const user = await this.findOne(username);
      if (!user) {
        return null;
      }

      // Compare the provided password with the stored hash
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error during authentication');
    }
  }

  /**
   * Generate a JWT token for a user
   * @param user The user to generate a token for
   * @returns An object containing the access token
   */
  generateToken(user: AuthUser): { access_token: string } {
    try {
      // Create the JWT payload
      const payload = {
        username: user.username,
        sub: user.id,
        role: user.role,
      };

      // Sign the token
      const token = this.jwtService.sign(payload);
      return { access_token: token };
    } catch (error) {
      this.logger.error(
        `Error generating token: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to generate authentication token',
      );
    }
  }

  /**
   * Update a user's password
   * @param userId The ID of the user to update
   * @param newPassword The new password to set
   * @returns The updated user
   */
  async updatePassword(userId: string, newPassword: string): Promise<Auth> {
    try {
      // Find the user
      const user = await this.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Hash the new password
      const saltRounds = process.env.SALT || '10';
      const hashed = await bcrypt.hash(newPassword, Number(saltRounds));

      // Update and save the user
      user.password = hashed;
      return await this.authRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error updating password: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update password');
    }
  }

  /**
   * Delete all users (admin function)
   * @returns The result of the delete operation
   */
  async deleteAll() {
    try {
      this.logger.warn('Deleting all users from the database');
      return await this.authRepository.delete({});
    } catch (error) {
      this.logger.error(
        `Error deleting all users: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete all users');
    }
  }

  /**
   * Get all users
   * @returns Array of all users
   */
  async getAll(): Promise<Auth[]> {
    try {
      return await this.authRepository.find();
    } catch (error) {
      this.logger.error(
        `Error retrieving all users: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  /**
   * Delete a user by username
   * @param username The username of the user to delete
   * @returns The result of the delete operation
   */
  async deleteOne(username: string) {
    try {
      const user = await this.findOne(username);
      if (!user) {
        throw new NotFoundException(`User with username ${username} not found`);
      }

      return await this.authRepository.delete({ username });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
