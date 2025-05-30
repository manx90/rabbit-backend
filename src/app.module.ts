import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { OptosModule } from './optos/optos.module';
import { OrderModule } from './order/order.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        global: true,
        secret: config.jwtAccessToken,
        signOptions: { expiresIn: config.jwtExpiration || '30d' },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: 'mysql',
        host: config.host,
        port: config.port,
        username: config.user,
        password: config.pass,
        database: config.db,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        migrationsRun: true,
      }),
    }),
    AuthModule,
    OrderModule,
    ProductModule,
    OptosModule,
  ],
})
export class AppModule {}
