import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryModel } from './delivery.model';

export interface CreateDeliveryDto {
  cityName: string;
  optusId?: string;
  price: number;
}

export interface UpdateDeliveryDto {
  cityName?: string;
  optusId?: string;
  price?: number;
}

@Injectable()
export class DeliveryRepository {
  constructor(
    @InjectRepository(DeliveryModel)
    private readonly deliveryRepo: Repository<DeliveryModel>,
  ) {}

  async createDelivery(dto: CreateDeliveryDto): Promise<DeliveryModel> {
    // Check if city already exists
    const existingDelivery = await this.deliveryRepo.findOne({
      where: { cityName: dto.cityName },
    });

    if (existingDelivery) {
      throw new BadRequestException(
        `Delivery for city ${dto.cityName} already exists`,
      );
    }

    const delivery = new DeliveryModel();
    delivery.cityName = dto.cityName;
    delivery.optusId = dto.optusId ?? '';
    delivery.price = dto.price;

    return this.deliveryRepo.save(delivery);
  }

  async getAllDeliveries(): Promise<DeliveryModel[]> {
    return this.deliveryRepo.find({
      order: { cityName: 'ASC' },
    });
  }

  async getDeliveries(): Promise<DeliveryModel[]> {
    return this.deliveryRepo.find({
      order: { cityName: 'ASC' },
    });
  }

  async getDeliveryById(id: number): Promise<DeliveryModel> {
    const delivery = await this.deliveryRepo.findOne({ where: { id } });
    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }
    return delivery;
  }

  async getDeliveryByCity(cityName: string): Promise<DeliveryModel> {
    const delivery = await this.deliveryRepo.findOne({
      where: { cityName },
    });
    if (!delivery) {
      throw new NotFoundException(`Delivery for city ${cityName} not found`);
    }
    return delivery;
  }

  async getDeliveryByOptusId(optusId: string): Promise<DeliveryModel> {
    const delivery = await this.deliveryRepo.findOne({
      where: { optusId },
    });
    if (!delivery) {
      throw new NotFoundException(
        `Delivery with Optus ID ${optusId} not found`,
      );
    }
    return delivery;
  }

  async updateDelivery(
    id: number,
    dto: UpdateDeliveryDto,
  ): Promise<DeliveryModel> {
    const delivery = await this.getDeliveryById(id);

    // Check if city name is being changed and if it already exists
    if (dto.cityName && dto.cityName !== delivery.cityName) {
      const existingDelivery = await this.deliveryRepo.findOne({
        where: { cityName: dto.cityName },
      });
      if (existingDelivery) {
        throw new BadRequestException(
          `Delivery for city ${dto.cityName} already exists`,
        );
      }
    }

    if (dto.cityName) delivery.cityName = dto.cityName;
    if (dto.optusId !== undefined) delivery.optusId = dto.optusId;
    if (dto.price !== undefined) delivery.price = dto.price;

    return this.deliveryRepo.save(delivery);
  }

  async deleteDelivery(id: number): Promise<void> {
    const delivery = await this.getDeliveryById(id);
    await this.deliveryRepo.remove(delivery);
  }

  async searchDeliveries(searchTerm: string): Promise<DeliveryModel[]> {
    return this.deliveryRepo
      .createQueryBuilder('delivery')
      .where('delivery.cityName ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orWhere('delivery.optusId ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('delivery.cityName', 'ASC')
      .getMany();
  }

  async getDeliveryPriceByCity(cityName: string): Promise<number> {
    const delivery = await this.getDeliveryByCity(cityName);
    return delivery.price;
  }

  async getDeliveryPriceByOptusId(optusId: string): Promise<number> {
    const delivery = await this.getDeliveryByOptusId(optusId);
    return delivery.price;
  }

  async countDeliveries(): Promise<number> {
    return this.deliveryRepo.count();
  }

  async bulkCreateDeliveries(
    deliveries: CreateDeliveryDto[],
  ): Promise<DeliveryModel[]> {
    const createdDeliveries: DeliveryModel[] = [];

    for (const dto of deliveries) {
      try {
        const delivery = await this.createDelivery(dto);
        createdDeliveries.push(delivery);
      } catch (error) {
        // Log error but continue with other deliveries
        console.error(
          `Failed to create delivery for city ${dto.cityName}:`,
          (error as Error).message,
        );
      }
    }

    return createdDeliveries;
  }
}
