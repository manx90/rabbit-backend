/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
  Get,
  Delete,
  UseGuards,
  Req,
  Param,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto, RegisterDto, ChangePasswordDto } from './dto/auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.constant';

interface RequestWithUser extends Request {
  user: { id: string; username: string; role: Role };
}

@Controller('auth')
export class AuthController {
  @Post('create-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Req() req: RequestWithUser,
  ) {
    return this.authService.createUser(createUserDto, req.user.id);
  }

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'User register' })
  @ApiResponse({ status: 201, description: 'register successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(@Body() dto: RegisterDto) {
    try {
      const result = await this.authService.signUp(dto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: result,
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    try {
      const result = await this.authService.logIn(dto);
      return {
        statusCode: HttpStatus.OK,
        message: 'User logged in successfully',
        data: result,
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  getProfile(@Req() req: RequestWithUser) {
    return { statusCode: HttpStatus.OK, data: req.user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('all')
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @Delete('user/:username')
  deleteUser(@Param('username') username: string) {
    return this.authService.deleteUser(username);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Post('update-user/:userId')
  async updateUser(
    @Req() req: RequestWithUser,
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updatedUser = await this.authService.updateUserBySuperAdmin(
        req.user,
        userId,
        updateUserDto,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('isLoggedIn')
  isLoggedIn(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const authHeader = req.headers['authorization'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const token = authHeader && authHeader.split(' ')[1];
    return this.authService.isLoggedIn(token);
  }
}
