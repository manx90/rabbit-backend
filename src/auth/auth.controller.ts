import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { JwtAuthGuard } from './auth.guard';
import { Request as ExpressRequest } from 'express';

interface Request extends ExpressRequest {
  user: any;
}
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<any> {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: Request): any {
    return req.user;
  }
}
