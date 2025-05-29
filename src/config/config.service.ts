import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
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
