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

import { auth } from '../../auth/entities/auth.entity';
import { AuthUser } from '../../auth/dto/auth.dto';
import { Role } from '../constants/roles.constant';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(
    @InjectRepository(auth)
    private readonly authRepository: Repository<auth>,
    private readonly jwtService: JwtService,
  ) {}

  /** Update user by ID */
  async update(userId: string, updateUserDto: UpdateUserDto): Promise<auth> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // تحديث خصائص المستخدم بالبيانات الجديدة من updateUserDto
    Object.assign(user, updateUserDto);

    try {
      return await this.authRepository.save(user);
    } catch (error: any) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  /** Find a user by username */
  async findOne(username: string): Promise<auth | null> {
    try {
      return await this.authRepository.findOne({ where: { username } });
    } catch (error: any) {
      this.logger.error(`Error finding user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error finding user');
    }
  }

  /** Find a user by ID */
  async findById(id: string): Promise<auth | null> {
    try {
      return await this.authRepository.findOne({ where: { id } });
    } catch (error: any) {
      this.logger.error(
        `Error finding user by ID: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error finding user');
    }
  }

  /** Save a new user */
  async save(user: AuthUser): Promise<auth> {
    const exists = await this.findOne(user.username);
    if (exists) {
      throw new ConflictException('Username already taken');
    }

    const saltRounds = Number(process.env.SALT) || 10;
    const hashed = await bcrypt.hash(user.password, saltRounds);

    const entity = new auth();
    entity.username = user.username;
    entity.password = hashed;
    entity.role = user.role ?? Role.Salesman;

    try {
      return await this.authRepository.save(entity);
    } catch (error: any) {
      this.logger.error(`Error saving user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /** Validate credentials */
  async validateUser(username: string, password: string): Promise<auth | null> {
    const user = await this.findOne(username);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }

  /** Generate JWT token */
  generateToken(user: auth): { access_token: string } {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  /** Update password */
  async updatePassword(id: string, newPwd: string): Promise<auth> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const saltRounds = Number(process.env.SALT) || 10;
    user.password = await bcrypt.hash(newPwd, saltRounds);
    return this.authRepository.save(user);
  }

  /** Delete all users */
  async deleteAll(): Promise<void> {
    await this.authRepository.clear();
  }

  /** Get all users */
  async getAll(): Promise<auth[]> {
    return this.authRepository.find();
  }

  /** Delete one user by username */
  async deleteOne(username: string): Promise<void> {
    const user = await this.findOne(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.authRepository.delete({ username });
  }
}
