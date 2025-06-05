import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { OptosService } from './optos.token.service';
import { OptosShipmentService } from './optos.shipment.service';
import { OptosApiService } from './optos.api.services';
// import { CreateShipmentDto } from './optos.dto';

@Controller('optos')
export class OptosController {
  constructor(
    private readonly optosService: OptosService,
    private readonly optosApiService: OptosApiService,
    private readonly optosShipmentService: OptosShipmentService,
  ) {}

  @Get('token')
  async getToken(): Promise<any> {
    try {
      return await this.optosService.Login();
    } catch (error) {
      this.handleError(error);
    }
  }
  @Post('token')
  async getInfo(@Body('access-token') token: string): Promise<any> {
    try {
      if (!token) {
        throw new HttpException(
          'Access token is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.optosService.userInfo(token);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('Shipment')
  async createShipment(@Body() createshipment: any): Promise<any> {
    try {
      return await this.optosShipmentService.createShipment(createshipment);
    } catch (error) {
      this.handleError(error);
    }
  }
  @Get('city')
  async getCities(): Promise<any> {
    try {
      return await this.optosApiService.Cities();
    } catch (error) {
      this.handleError(error);
    }
  }
  @Get('businesses')
  async getBusinesses(): Promise<any> {
    try {
      return await this.optosApiService.Businesses();
    } catch (error) {
      this.handleError(error);
    }
  }
  @Get('BusinessesAddress')
  async getBusinessesAddress(): Promise<any> {
    try {
      return await this.optosApiService.BusinessesAddress();
    } catch (error) {
      this.handleError(error);
    }
  }
  @Get('city/:area')
  async getArea(@Param('area') area: number): Promise<any> {
    try {
      return this.optosApiService.Area(area);
    } catch (error) {
      this.handleError(error);
    }
  }
  @Get('shipment')
  async getShipment(): Promise<any> {
    try {
      return this.optosShipmentService.getShipment();
    } catch (error) {
      this.handleError(error);
    }
  }
  @Get('shipmentType')
  async getShipmentType(): Promise<any> {
    try {
      return this.optosShipmentService.getShipmentType();
    } catch (error) {
      this.handleError(error);
    }
  }
  @Get('pendingTypes')
  async getPendingTypes(): Promise<any> {
    try {
      return this.optosShipmentService.getPendingTypes();
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const message = error.message || 'Failed to get pending types';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    throw new HttpException({ message, status }, status);
  }
}
