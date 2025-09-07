import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { FileStorageModule } from './file-storage/file-storage.module';
import { OptosModule } from './optos/optos.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        global: true,
        secret: config.jwtAccessToken,
        signOptions: { expiresIn: config.jwtExpiration },
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
        synchronize: process.env.NODE_ENV !== 'production', // Disable in production
        migrationsRun: true,
        // Memory optimization for cPanel
        extra: {
          connectionLimit: process.env.NODE_ENV === 'production' ? 3 : 10,
          // Reduce memory usage
          maxIdle: 10000,
          idleTimeout: 60000,
        },
        // Disable logging in production to save memory
        logging: false, // Set to false to disable all query logging
      }),
    }),
    AuthModule,
    OrderModule,
    ProductModule,
    OptosModule,
    FileStorageModule,
  ],
})
export class AppModule {}
