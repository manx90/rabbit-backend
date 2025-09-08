"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DatabaseBootstrapService", {
    enumerable: true,
    get: function() {
        return DatabaseBootstrapService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _loggerservice = require("./logger.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DatabaseBootstrapService = class DatabaseBootstrapService {
    async onApplicationBootstrap() {
        try {
            this.logger.info('Running database bootstrap checks...', 'DB_BOOTSTRAP');
            // Ensure product.isManualPublishState exists
            const [rows] = await this.dataSource.query("SHOW COLUMNS FROM `product` LIKE 'isManualPublishState'");
            if (!rows || rows.length === 0) {
                this.logger.warn('Column product.isManualPublishState missing. Adding it now...', 'DB_BOOTSTRAP');
                await this.dataSource.query('ALTER TABLE `product` ADD COLUMN `isManualPublishState` TINYINT(1) NOT NULL DEFAULT 0');
                this.logger.info('Added column product.isManualPublishState successfully.', 'DB_BOOTSTRAP');
            } else {
                this.logger.info('Column product.isManualPublishState already exists.', 'DB_BOOTSTRAP');
            }
        } catch (error) {
            this.logger.logError(error, 'DB_BOOTSTRAP');
        // Do not throw; avoid crashing Passenger
        }
    }
    constructor(dataSource, logger){
        this.dataSource = dataSource;
        this.logger = logger;
    }
};
DatabaseBootstrapService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource,
        typeof _loggerservice.LoggerService === "undefined" ? Object : _loggerservice.LoggerService
    ])
], DatabaseBootstrapService);

//# sourceMappingURL=database-bootstrap.service.js.map