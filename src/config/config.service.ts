import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  static MYSQL_HOST: string | undefined;
  static MYSQL_USER: string | undefined;
  static MYSQL_PASSWORD: string | undefined;
  static MYSQL_PORT: number | undefined;
  static MYSQL_DB: string | undefined;
  static host: string | undefined;
  static port: number | undefined;
  static user: string | undefined;
  static pass: string | undefined;
  static db: string | undefined;
  constructor(private configService: ConfigService) {}

  get host() {
    return this.configService.get<string>('MYSQL_HOST');
  }

  get port() {
    return this.configService.get<number>('MYSQL_PORT');
  }

  get user() {
    return this.configService.get<string>('MYSQL_USER');
  }

  get pass() {
    return this.configService.get<string>('MYSQL_PASSWORD');
  }

  get db() {
    return this.configService.get<string>('MYSQL_DB');
  }

  get jwtAccessToken() {
    return this.configService.get<string>('JWT_ACCESS_SECRET');
  }

  get jwtExpiration() {
    return this.configService.get<string>('JWT_EXPIRATION');
  }
}
