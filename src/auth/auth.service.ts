/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Auth } from './entities/auth.entity';
import {
  AuthUser,
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import { AuthRepository } from '../common/Repositories/auth.repository';
import { ConfigService } from '@nestjs/config';

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
    private readonly configService: ConfigService,
  ) {}

  // -------------------------
  // Registration
  // -------------------------
  async signUp(registerDto: RegisterDto) {
    this.logger.log(`Registering user: ${registerDto.username}`);
    const exists = await this.authRepository.findOne(registerDto.username);
    if (exists) throw new BadRequestException('Username already exists');

    // Create new user
    const newUser = await this.authRepository.save(registerDto as AuthUser);

    // Build JWT payload and sign
    const payload = {
      sub: String(newUser.id),
      username: newUser.username,
      role: newUser.role,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'default_secret',
    });

    return { access_token, user: this.toSafeUser(newUser) };
  }

  // -------------------------
  // Login
  // -------------------------
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
    const access_token = this.jwtService.sign(payload);
    return { access_token, user };
  }

  // -------------------------
  // Credential Validation
  // -------------------------
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

  // -------------------------
  // Look-ups (for strategies)
  // -------------------------
  async findByUsername(username: string): Promise<AuthenticatedUser | null> {
    const user = await this.authRepository.findOne(username);
    return user ? this.toSafeUser(user) : null;
  }

  async findById(id: string): Promise<AuthenticatedUser | null> {
    const user = await this.authRepository.findById(id);
    return user ? this.toSafeUser(user) : null;
  }

  // -------------------------
  // Change Password
  // -------------------------
  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ success: boolean }> {
    const user = await this.authRepository.findById(userId);
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const valid = await this.validateUser(user.username, dto.oldPassword);
    if (!valid)
      throw new UnauthorizedException('Current password is incorrect');

    await this.authRepository.updatePassword(userId, dto.newPassword);
    return { success: true };
  }

  // -------------------------
  // Admin helpers
  // -------------------------
  async getAllUsers(): Promise<AuthenticatedUser[]> {
    const users = await this.authRepository.getAll();
    return users.map((u) => this.toSafeUser(u));
  }

  async deleteUser(username: string): Promise<void> {
    // deleteOne now returns DeleteResult and throws if missing
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
      const payload = this.jwtService.verify<{ role?: string }>(token);
      return payload.role === 'Admin' || payload.role === 'SuperAdmin';
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

  // -------------------------
  // Utils
  // -------------------------
  private toSafeUser(user: Auth): AuthenticatedUser {
    const { password, ...safe } = user;
    return safe as AuthenticatedUser;
  }
}
