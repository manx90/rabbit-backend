import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductCollectionService } from './product-collection.service';
import {
  CreateProductCollectionDto,
  UpdateProductCollectionDto,
  ProductCollectionResponseDto,
} from './dto/product-collection.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.constant';
import { Request } from 'express';
import { auth } from 'src/auth/entities/auth.entity';

@ApiTags('Product Collections')
@Controller('collections')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductCollectionController {
  constructor(private readonly collectionService: ProductCollectionService) {}

  // ==================== ADMIN ENDPOINTS ====================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product collection (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Collection created successfully',
    type: ProductCollectionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found - categories, subcategories, or products not found',
  })
  async createCollection(
    @Body() createDto: CreateProductCollectionDto,
    @Req() req: Request,
  ) {
    try {
      const user = req.user as auth;
      return await this.collectionService.create(createDto, user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create collection',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all collections with pagination (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Collections retrieved successfully',
  })
  async getAllCollections(@Query() query: any) {
    try {
      return await this.collectionService.getAllCollections(query);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve collections',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific collection by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Collection retrieved successfully',
    type: ProductCollectionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Collection not found',
  })
  async getCollectionById(@Param('id') id: number) {
    try {
      return await this.collectionService.findOne(+id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve collection',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a collection (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Collection updated successfully',
    type: ProductCollectionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Collection, categories, subcategories, or products not found',
  })
  async updateCollection(
    @Param('id') id: number,
    @Body() updateDto: UpdateProductCollectionDto,
  ) {
    try {
      return await this.collectionService.update(+id, updateDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update collection',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a collection (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Collection deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Collection not found',
  })
  async deleteCollection(@Param('id') id: number) {
    try {
      await this.collectionService.remove(+id);
      return { message: 'Collection deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete collection',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== CLIENT ENDPOINTS ====================

  @Get()
  @ApiOperation({ summary: 'Get all active collections (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Active collections retrieved successfully',
  })
  async getActiveCollections() {
    try {
      return await this.collectionService.getActiveCollections();
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve active collections',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('priority')
  @ApiOperation({ summary: 'Get priority collections (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Priority collections retrieved successfully',
  })
  async getPriorityCollections() {
    try {
      return await this.collectionService.getPriorityCollections();
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve priority collections',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('priority/:minPriority')
  @ApiOperation({ summary: 'Get collections with minimum priority (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Collections with minimum priority retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid priority parameter',
  })
  async getCollectionsByMinPriority(@Param('minPriority') minPriority: number) {
    try {
      if (isNaN(+minPriority) || +minPriority < 0) {
        throw new BadRequestException('Invalid priority parameter');
      }
      return await this.collectionService.getCollectionsByPriority(
        +minPriority,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve collections by priority',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('priority-range')
  @ApiOperation({
    summary:
      'Get collections by priority range using query parameters (Public)',
  })
  @ApiResponse({
    status: 200,
    description: 'Collections by priority range retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid priority parameters',
  })
  async getCollectionsByPriorityQuery(
    @Query('minPriority') minPriority: number,
    @Query('maxPriority') maxPriority?: number,
  ) {
    try {
      if (isNaN(+minPriority) || +minPriority < 0) {
        throw new BadRequestException('Invalid minPriority parameter');
      }
      if (maxPriority && (isNaN(+maxPriority) || +maxPriority < +minPriority)) {
        throw new BadRequestException('Invalid maxPriority parameter');
      }
      return await this.collectionService.getCollectionsByPriority(
        +minPriority,
        maxPriority ? +maxPriority : undefined,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve collections by priority range',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('priority/:minPriority/:maxPriority')
  @ApiOperation({ summary: 'Get collections by priority range (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Collections by priority range retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid priority parameters',
  })
  async getCollectionsByPriorityRange(
    @Param('minPriority') minPriority: number,
    @Param('maxPriority') maxPriority: number,
  ) {
    try {
      if (isNaN(+minPriority) || +minPriority < 0) {
        throw new BadRequestException('Invalid minPriority parameter');
      }
      if (isNaN(+maxPriority) || +maxPriority < +minPriority) {
        throw new BadRequestException('Invalid maxPriority parameter');
      }
      return await this.collectionService.getCollectionsByPriority(
        +minPriority,
        +maxPriority,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve collections by priority range',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Get products from a specific collection (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Collection products retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Collection not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Collection is not active or valid',
  })
  async getCollectionProducts(
    @Param('id') id: number,
    @Query() query: any,
    @Req() req: Request,
  ) {
    try {
      if (isNaN(+id) || +id <= 0) {
        throw new BadRequestException('Invalid collection ID');
      }
      return await this.collectionService.getCollectionProducts(
        +id,
        query,
        req,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve collection products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/with-products')
  @ApiOperation({
    summary: 'Get collection with its products (paginated, 10 per page)',
  })
  @ApiResponse({
    status: 200,
    description: 'Collection with products retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Collection not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters',
  })
  async getCollectionWithProducts(
    @Param('id') id: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request,
  ) {
    try {
      if (isNaN(+id) || +id <= 0) {
        throw new BadRequestException('Invalid collection ID');
      }
      if (isNaN(+page) || +page < 1) {
        throw new BadRequestException('Invalid page parameter');
      }
      if (isNaN(+limit) || +limit < 1 || +limit > 100) {
        throw new BadRequestException('Invalid limit parameter (1-100)');
      }
      return await this.collectionService.getCollectionWithProducts(
        +id,
        +page,
        +limit,
        req,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve collection with products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== UTILITY ENDPOINTS ====================

  @Get('featured/products')
  @ApiOperation({ summary: 'Get products from featured collections (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Featured collection products retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'No featured collections found',
  })
  async getFeaturedCollectionProducts(
    @Query() query: any,
    @Req() req: Request,
  ) {
    try {
      // This endpoint will get products from all featured collections
      const activeCollections =
        await this.collectionService.getActiveCollections();
      const featuredCollections = activeCollections.filter(
        (collection) => collection.isFeatured,
      );

      if (featuredCollections.length === 0) {
        throw new BadRequestException('No featured collections found');
      }

      // For now, return products from the first featured collection
      // You can enhance this to combine products from multiple featured collections
      const firstFeatured = featuredCollections[0];
      return await this.collectionService.getCollectionProducts(
        firstFeatured.id,
        query,
        req,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve featured collection products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
