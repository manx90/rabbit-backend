import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { AuthMiddleware } from './auth.middleware';
import { SuperAdminGuard } from './guards';
dotenv.config({ path: '.env' });

const jwtSecret = process.env.JWT_SECRET;
const jwtExpTime = process.env.JWT_EXPIRATION_TIME;

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: jwtExpTime },
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, SuperAdminGuard],
  exports: [AuthService],
})
export class AuthMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth', method: RequestMethod.DELETE },
        { path: '/auth/login', method: RequestMethod.POST },
      )
      .forRoutes(
        { path: '/auth/*', method: RequestMethod.ALL },
        { path: '/auth', method: RequestMethod.ALL },
      );
  }
}

export class AuthModule {}
