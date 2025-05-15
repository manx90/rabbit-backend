/* eslint-disable @typescript-eslint/require-await */
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Get,
  Delete,
  Request,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { SuperAdminGuard } from './guards/super-admin.guard';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(SuperAdminGuard)
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.signUp(registerDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.logIn(loginDto);
      return {
        HttpException: HttpStatus.OK,
        message: 'User logged in successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          message: error.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    const result = await this.authService.getUser(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User fetched successfully',
      data: result,
    };
  }

  @Delete()
  async deleteAll() {
    const result = await this.authService.deleteAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'All users deleted successfully',

      data: result,
    };
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const result = this.authService.DeleteOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: result,
    };
  }
  @Get('isAdmin')
  async isAdmin(@Request() req): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const result = await this.authService.isAdmin(req.headers.authorization);
    return {
      statusCode: HttpStatus.OK,

      data: result,
    };
  }
  @Get()
  async getAllUsers() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const result = this.authService.GetAll();
    return {
      statusCode: HttpStatus.OK,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: result,
    };
  }

  @Delete('user')
  @HttpCode(HttpStatus.OK)
  async deleteOne(@Body('username') username: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const result = this.authService.DeleteOne(username);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: result,
    };
  }
}
