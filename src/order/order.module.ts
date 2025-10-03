import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { DeliveryController } from './delivery.controller';
import { OrderService } from './order.service';
import { order, orderitem } from './order.entity';
import { DeliveryModel } from './delivery.model';
import { product } from '../product/entities/product.entity';
import { auth } from '../auth/entities/auth.entity';
// import { HttpModule } from '@nestjs/axios';
import { OrderRepository } from './order.repository';
import { DeliveryRepository } from './delivery.repository';
import { AuthRepository } from '../common/Repositories/auth.repository';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { OptosShipmentService } from '../optos/optos.shipment.service';
import { OptosModule } from '../optos/optos.module';
import { OptosService } from '../optos/optos.token.service';
import { OptosApiService } from '../optos/optos.api.services';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    TypeOrmModule.forFeature([order, orderitem, product, auth, DeliveryModel]),
    AuthModule,
    OptosModule,
    HttpModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [OrderController, DeliveryController],
  providers: [
    OrderService,
    OrderRepository,
    DeliveryRepository,
    AuthRepository,
    OptosShipmentService,
    OptosService,
    OptosApiService,
  ],
  exports: [OrderService],
})
export class OrderModule {}
