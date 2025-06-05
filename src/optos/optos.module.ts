import { Module } from '@nestjs/common';
import { OptosController } from './optos.controller';
import { OptosService } from './optos.token.service';
import { OptosShipmentService } from './optos.shipment.service';
import { OptosApiService } from './optos.api.services';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from '../config/config.service';
@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [OptosController],
  providers: [
    OptosService,
    OptosShipmentService,
    OptosApiService,
    AppConfigService,
  ],
  exports: [
    OptosService,
    OptosShipmentService,
    OptosApiService,
    AppConfigService,
  ],
})
export class OptosModule {}
