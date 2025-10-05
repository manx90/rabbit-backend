import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { DeliveryRepository } from './delivery.repository';
import { CreateDeliveryDto, UpdateDeliveryDto } from './delivery.dto';

@ApiTags('Delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new delivery' })
  @ApiBody({ type: CreateDeliveryDto })
  @ApiCreatedResponse({ description: 'Delivery created successfully' })
  @ApiBadRequestResponse({ description: 'Bad request - validation failed' })
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
    try {
      const delivery =
        await this.deliveryRepository.createDelivery(createDeliveryDto);
      return {
        success: true,
        message: 'Delivery created successfully',
        data: delivery,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all deliveries' })
  @ApiOkResponse({ description: 'Deliveries retrieved successfully' })
  async getAllDeliveries() {
    try {
      const deliveries = await this.deliveryRepository.getAllDeliveries();
      return {
        success: true,
        message: 'Deliveries retrieved successfully',
        data: deliveries,
        count: deliveries.length,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get delivery by ID' })
  @ApiParam({ name: 'id', description: 'Delivery ID', type: 'number' })
  @ApiOkResponse({ description: 'Delivery retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Delivery not found' })
  async getDeliveryById(@Param('id', ParseIntPipe) id: number) {
    try {
      const delivery = await this.deliveryRepository.getDeliveryById(id);
      return {
        success: true,
        message: 'Delivery retrieved successfully',
        data: delivery,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  @Get('city/:cityName')
  async getDeliveryByCity(@Param('cityName') cityName: string) {
    try {
      const delivery =
        await this.deliveryRepository.getDeliveryByCity(cityName);
      return {
        success: true,
        message: 'Delivery retrieved successfully',
        data: delivery,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  @Get('optus/:optusId')
  async getDeliveryByOptusId(@Param('optusId') optusId: string) {
    try {
      const delivery =
        await this.deliveryRepository.getDeliveryByOptusId(optusId);
      return {
        success: true,
        message: 'Delivery retrieved successfully',
        data: delivery,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  @Get('price/city/:cityName')
  async getDeliveryPriceByCity(@Param('cityName') cityName: string) {
    try {
      const price =
        await this.deliveryRepository.getDeliveryPriceByCity(cityName);
      return {
        success: true,
        message: 'Delivery price retrieved successfully',
        data: { cityName, price },
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  @Get('price/optus/:optusId')
  async getDeliveryPriceByOptusId(@Param('optusId') optusId: string) {
    try {
      const price =
        await this.deliveryRepository.getDeliveryPriceByOptusId(optusId);
      return {
        success: true,
        message: 'Delivery price retrieved successfully',
        data: { optusId, price },
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update delivery by ID' })
  @ApiParam({ name: 'id', description: 'Delivery ID', type: 'number' })
  @ApiBody({ type: UpdateDeliveryDto })
  @ApiOkResponse({ description: 'Delivery updated successfully' })
  @ApiNotFoundResponse({ description: 'Delivery not found' })
  @ApiBadRequestResponse({ description: 'Bad request - validation failed' })
  async updateDelivery(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
  ) {
    try {
      const delivery = await this.deliveryRepository.updateDelivery(
        id,
        updateDeliveryDto,
      );
      return {
        success: true,
        message: 'Delivery updated successfully',
        data: delivery,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete delivery by ID' })
  @ApiParam({ name: 'id', description: 'Delivery ID', type: 'number' })
  @ApiNoContentResponse({ description: 'Delivery deleted successfully' })
  @ApiNotFoundResponse({ description: 'Delivery not found' })
  async deleteDelivery(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.deliveryRepository.deleteDelivery(id);
      return {
        success: true,
        message: 'Delivery deleted successfully',
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  @Get('search/:term')
  async searchDeliveries(@Param('term') searchTerm: string) {
    try {
      const deliveries =
        await this.deliveryRepository.searchDeliveries(searchTerm);
      return {
        success: true,
        message: 'Search completed successfully',
        data: deliveries,
        count: deliveries.length,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  @Get('stats/count')
  async getDeliveryCount() {
    try {
      const count = await this.deliveryRepository.countDeliveries();
      return {
        success: true,
        message: 'Delivery count retrieved successfully',
        data: { count },
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async bulkCreateDeliveries(@Body() deliveries: CreateDeliveryDto[]) {
    try {
      const createdDeliveries =
        await this.deliveryRepository.bulkCreateDeliveries(deliveries);
      return {
        success: true,
        message: `Bulk created ${createdDeliveries.length} deliveries successfully`,
        data: createdDeliveries,
        count: createdDeliveries.length,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        data: null,
      };
    }
  }
}
