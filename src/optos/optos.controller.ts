import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { OptosService } from './optos.token.service';
import { OptosShipmentService } from './optos.shipment.service';
import { OptosApiService } from './optos.api.services';
// import { CreateShipmentDto } from './optos.dto';

@ApiTags('Optos Integration')
@Controller('optos')
export class OptosController {
  constructor(
    private readonly optosService: OptosService,
    private readonly optosApiService: OptosApiService,
    private readonly optosShipmentService: OptosShipmentService,
  ) {}

  @Get('token')
  @ApiOperation({ summary: 'Get Optos authentication token' })
  @ApiOkResponse({ description: 'Token retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getToken(): Promise<any> {
    try {
      return await this.optosService.Login();
    } catch (error) {
      this.handleError(error);
    }
  }
  @Post('token')
  @ApiOperation({ summary: 'Get user info using access token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        'access-token': { type: 'string', description: 'Access token' },
      },
      required: ['access-token'],
    },
  })
  @ApiOkResponse({ description: 'User info retrieved successfully' })
  @ApiBadRequestResponse({ description: 'Access token is required' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
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
  @ApiOperation({ summary: 'Create a new shipment' })
  @ApiBody({
    description: 'Shipment data',
    schema: {
      type: 'object',
      properties: {
        // Add specific shipment properties here
      },
    },
  })
  @ApiOkResponse({ description: 'Shipment created successfully' })
  @ApiBadRequestResponse({ description: 'Bad request - invalid shipment data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async createShipment(@Body() createshipment: any): Promise<any> {
    try {
      return await this.optosShipmentService.createShipment(createshipment);
    } catch (error) {
      this.handleError(error);
    }
  }
  @Get('city')
  @ApiOperation({ summary: 'Get all cities' })
  @ApiOkResponse({ description: 'Cities retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getCities(): Promise<any> {
    try {
      return await this.optosApiService.Cities();
    } catch (error) {
      this.handleError(error);
    }
  }
  @Get('businesses')
  @ApiOperation({ summary: 'Get all businesses' })
  @ApiOkResponse({ description: 'Businesses retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getBusinesses(): Promise<any> {
    try {
      return await this.optosApiService.Businesses();
    } catch (error) {
      this.handleError(error);
    }
  }
  @Get('BusinessesAddress')
  @ApiOperation({ summary: 'Get businesses addresses' })
  @ApiOkResponse({ description: 'Businesses addresses retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getBusinessesAddress(): Promise<any> {
    try {
      return await this.optosApiService.BusinessesAddress();
    } catch (error) {
      this.handleError(error);
    }
  }
  @Get('city/:area')
  @ApiOperation({ summary: 'Get area by city ID' })
  @ApiParam({ name: 'area', description: 'Area ID', type: 'number' })
  @ApiOkResponse({ description: 'Area retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getArea(@Param('area') area: number): Promise<any> {
    try {
      return this.optosApiService.Area(area);
    } catch (error) {
      this.handleError(error);
    }
  }
  @Get('shipment')
  @ApiOperation({ summary: 'Get shipments with query parameters' })
  @ApiQuery({ name: 'query', description: 'Query parameters', required: false })
  @ApiOkResponse({ description: 'Shipments retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getShipment(@Query() query: Record<string, any>): Promise<any> {
    try {
      return this.optosShipmentService.getShipment(query);
    } catch (error) {
      this.handleError(error);
    }
  }
  @Get('shipmentType')
  @ApiOperation({ summary: 'Get shipment types' })
  @ApiOkResponse({ description: 'Shipment types retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getShipmentType(): Promise<any> {
    try {
      return this.optosShipmentService.getShipmentType();
    } catch (error) {
      this.handleError(error);
    }
  }
  @Get('pendingTypes')
  @ApiOperation({ summary: 'Get pending types' })
  @ApiOkResponse({ description: 'Pending types retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
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
