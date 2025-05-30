import { MigrationInterface, QueryRunner } from "typeorm";

export class YourMigrationName1748629790749 implements MigrationInterface {
    name = 'YourMigrationName1748629790749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`images\` json NULL, \`imgCover\` varchar(255) NULL, \`imgSizeChart\` varchar(255) NULL, \`imgMeasure\` varchar(255) NULL, \`sizeDetails\` json NOT NULL, \`publishState\` enum ('draft', 'published') NOT NULL DEFAULT 'draft', \`colors\` json NULL, \`quantity\` decimal NULL, \`isFeatured\` tinyint NOT NULL DEFAULT 0, \`isTrending\` tinyint NOT NULL DEFAULT 0, \`isNew\` tinyint NOT NULL DEFAULT 1, \`isBestSeller\` tinyint NOT NULL DEFAULT 0, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`sales\` int NOT NULL DEFAULT '0', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`PosterAt\` timestamp NULL, \`updatedAt\` timestamp NULL, \`categoryId\` int NULL, \`subCategoryId\` int NULL, \`posterId\` char(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`business\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`business_address\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`Cod_amount\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`consignee_address\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`consignee_area\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`consignee_city\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`consignee_name\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`consignee_phone\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`has_return\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`is_cod\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`items_description\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`notes\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`quantity\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`readyById\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`return_notes\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`shipment_types\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`readyBy\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD \`price\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_646bf9ece6f45dbe41c203e06e0\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`sizeName\` \`sizeName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`colorName\` \`colorName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP COLUMN \`orderId\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD \`orderId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`Product\` ADD CONSTRAINT \`FK_896e2e0f6dfa6f80117a79e1d7e\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Product\` ADD CONSTRAINT \`FK_2646f6bdf95330a9d7601b90f1e\` FOREIGN KEY (\`subCategoryId\`) REFERENCES \`subcategories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Product\` ADD CONSTRAINT \`FK_57cfafda94d308c3a0d2f9df396\` FOREIGN KEY (\`posterId\`) REFERENCES \`auths\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_fe5a36771151740b712e35586b6\` FOREIGN KEY (\`readyBy\`) REFERENCES \`auths\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_646bf9ece6f45dbe41c203e06e0\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_904370c093ceea4369659a3c810\` FOREIGN KEY (\`productId\`) REFERENCES \`Product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_904370c093ceea4369659a3c810\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_646bf9ece6f45dbe41c203e06e0\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_fe5a36771151740b712e35586b6\``);
        await queryRunner.query(`ALTER TABLE \`Product\` DROP FOREIGN KEY \`FK_57cfafda94d308c3a0d2f9df396\``);
        await queryRunner.query(`ALTER TABLE \`Product\` DROP FOREIGN KEY \`FK_2646f6bdf95330a9d7601b90f1e\``);
        await queryRunner.query(`ALTER TABLE \`Product\` DROP FOREIGN KEY \`FK_896e2e0f6dfa6f80117a79e1d7e\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP COLUMN \`orderId\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD \`orderId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`colorName\` \`colorName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`sizeName\` \`sizeName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_646bf9ece6f45dbe41c203e06e0\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`readyBy\``);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`shipment_types\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`return_notes\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`readyById\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`quantity\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`notes\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`items_description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`is_cod\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`has_return\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`consignee_phone\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`consignee_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`consignee_city\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`consignee_area\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`consignee_address\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`Cod_amount\` decimal NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`business_address\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`business\` int NOT NULL`);
        await queryRunner.query(`DROP TABLE \`Product\``);
    }

}
