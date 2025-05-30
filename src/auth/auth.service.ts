/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { auth } from './entities/auth.entity';
import {
  AuthUser,
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/constants/roles.constant';
import { AuthRepository } from '../common/Repositories/auth.repository';
import { AppConfigService } from '../config/config.service';

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
  ) {}

  async signUp(registerDto: RegisterDto) {
    this.logger.log(`Registering user: ${registerDto.username}`);
    const exists = await this.authRepository.findOne(registerDto.username);
    if (exists) throw new BadRequestException('Username already exists');

    const userToSave = {
      ...registerDto,
    };

    const newUser = await this.authRepository.save(userToSave as AuthUser);

    const payload = {
      sub: String(newUser.id),
      username: newUser.username,
      role: newUser.role,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.jwtAccessToken || 'default_secret',
    });

    const safeUser = this.toSafeUser(newUser);
    if (!safeUser)
      throw new InternalServerErrorException('Error creating user');
    return { access_token, user: safeUser };
  }

  async logIn(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: AuthenticatedUser }> {
    this.logger.log(`Login attempt: ${loginDto.username}`);
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid username or password');

    const payload = {
      sub: String(user.id),
      username: user.username,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.jwtAccessToken || 'default_secret',
    });
    return { access_token, user };
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    const user = await this.authRepository.findOne(username);
    if (!user) return null;

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) return null;

    return this.toSafeUser(user);
  }

  async createUser(
    createUserDto: CreateUserDto,
    creatorId: string,
  ): Promise<AuthenticatedUser> {
    const creator = await this.authRepository.findById(creatorId);
    if (!creator || creator.role !== Role.SuperAdmin) {
      throw new UnauthorizedException('Only SuperAdmin can create new users');
    }

    const exists = await this.authRepository.findOne(createUserDto.username);
    if (exists) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.authRepository.save({
      username: createUserDto.username,
      password: hashedPassword,
      role: createUserDto.role,
    } as AuthUser);

    const safeUser = this.toSafeUser(newUser);
    if (!safeUser)
      throw new InternalServerErrorException('Error creating user');
    return safeUser;
  }

  async findById(id: string): Promise<AuthenticatedUser | null> {
    const user = await this.authRepository.findById(id);
    return user ? this.toSafeUser(user) : null;
  }

  async findByUsername(username: string): Promise<AuthenticatedUser | null> {
    const user = await this.authRepository.findOne(username);
    return user ? this.toSafeUser(user) : null;
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ success: boolean }> {
    const user = await this.authRepository.findById(userId);
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const valid = await this.validateUser(user.username, dto.oldPassword);
    if (!valid)
      throw new UnauthorizedException('Current password is incorrect');

    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.authRepository.updatePassword(userId, hashedNewPassword);
    return { success: true };
  }

  async updateUserBySuperAdmin(
    adminUser: AuthenticatedUser,
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<AuthenticatedUser> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (adminUser.role !== Role.SuperAdmin) {
      throw new UnauthorizedException(
        'Only Super Admins can perform this action',
      );
    }

    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.authRepository.update(userId, updateUserDto);
    if (!updatedUser) {
      throw new InternalServerErrorException('Failed to update user');
    }

    return this.toSafeUser(updatedUser)!;
  }

  async getAllUsers(): Promise<AuthenticatedUser[]> {
    const users = await this.authRepository.getAll();
    return users
      .map((u) => this.toSafeUser(u))
      .filter((u): u is AuthenticatedUser => u !== null);
  }

  async deleteUser(username: string): Promise<void> {
    await this.authRepository.deleteOne(username);
  }

  async deleteAllUsers(): Promise<void> {
    await this.authRepository.deleteAll();
    this.logger.warn('All users have been deleted');
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async isAdmin(authorization: string): Promise<boolean> {
    if (!authorization?.startsWith('Bearer ')) return false;
    try {
      const token = authorization.slice(7);
      const payload = this.jwtService.verify<{ role?: string }>(token, {
        secret: this.configService.jwtAccessToken || 'default_secret',
      });
      return payload.role === Role.Admin || payload.role === Role.SuperAdmin;
    } catch (err: any) {
      this.logger.warn(`Invalid token: ${err.message}`);
      return false;
    }
  }

  getUserIdFromToken(token: string): string | null {
    try {
      const raw = token.startsWith('Bearer ') ? token.slice(7) : token;
      const decoded = this.jwtService.decode(raw) as { sub?: string };
      return decoded?.sub || null;
    } catch (err: any) {
      this.logger.error(`Error decoding token: ${err.message}`);
      return null;
    }
  }

  private toSafeUser(user: auth | null): AuthenticatedUser | null {
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
