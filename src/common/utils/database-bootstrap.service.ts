import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LoggerService } from './logger.service';

@Injectable()
export class DatabaseBootstrapService implements OnApplicationBootstrap {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: LoggerService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      this.logger.info('Running database bootstrap checks...', 'DB_BOOTSTRAP');

      // Ensure product.isManualPublishState exists
      const [rows]: any[] = await this.dataSource.query(
        "SHOW COLUMNS FROM `product` LIKE 'isManualPublishState'",
      );

      if (!rows || rows.length === 0) {
        this.logger.warn(
          'Column product.isManualPublishState missing. Adding it now...',
          'DB_BOOTSTRAP',
        );
        await this.dataSource.query(
          'ALTER TABLE `product` ADD COLUMN `isManualPublishState` TINYINT(1) NOT NULL DEFAULT 0',
        );
        this.logger.info(
          'Added column product.isManualPublishState successfully.',
          'DB_BOOTSTRAP',
        );
      } else {
        this.logger.info(
          'Column product.isManualPublishState already exists.',
          'DB_BOOTSTRAP',
        );
      }
    } catch (error) {
      this.logger.logError(error as Error, 'DB_BOOTSTRAP');
      // Do not throw; avoid crashing Passenger
    }
  }
}
