import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddlewareModule, AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { OptosModule } from './optos/optos.module';
import { OrderModule } from './order/order.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 4577,
      username: 'postgres',
      password: '457736',
      database: 'rabbit',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    OrderModule,
    ProductModule,
    OptosModule,
    AuthMiddlewareModule,
  ],
})
export class AppModule {}
