import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private ConfigService: ConfigService) {}

  get host() {
    return this.ConfigService.get<string>('POSTGRES_HOST');
  }
  get port() {
    return this.ConfigService.get<number>('POSTGRES_PORT');
  }
  get user() {
    return this.ConfigService.get<string>('POSTGRES_USER');
  }
  get pass() {
    return this.ConfigService.get<string>('POSTGRES_PASSWORD');
  }
  get db() {
    return this.ConfigService.get<string>('POSTGRES_DB');
  }
  get jwtSecret() {
    return this.ConfigService.get<string>('JWT_SECRET');
  }
  get jwtExp() {
    return this.ConfigService.get<string>('JWT_EXPIRATION');
  }
}
