/* eslint-disable prettier/prettier */ /* eslint-disable @typescript-eslint/no-unsafe-return */ /* eslint-disable @typescript-eslint/no-unsafe-assignment */ /* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable @typescript-eslint/no-unsafe-call */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SizeTableCrud", {
    enumerable: true,
    get: function() {
        return SizeTableCrud;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _sizeTableentity = require("./entities/sizeTable.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let SizeTableCrud = class SizeTableCrud {
    sanitizeSizeTable(sizeTable) {
        return {
            id: sizeTable.id,
            tableName: sizeTable.tableName,
            data: sizeTable.data
        };
    }
    async createSizeTable(createDto) {
        try {
            const sizeTable = new _sizeTableentity.SizeTable();
            sizeTable.tableName = createDto.tableName;
            sizeTable.data = {
                tableName: createDto.tableName,
                dimensions: createDto.dimensions
            };
            const savedSizeTable = await this.sizeTableRepo.save(sizeTable);
            return this.sanitizeSizeTable(savedSizeTable);
        } catch (error) {
            console.error('Error creating size table:', error);
            return null;
        }
    }
    async getAllSizeTables() {
        try {
            const sizeTables = await this.sizeTableRepo.find({
                order: {
                    tableName: 'ASC'
                }
            });
            return sizeTables.map((sizeTable)=>this.sanitizeSizeTable(sizeTable));
        } catch (error) {
            console.error('Error getting all size tables:', error);
            return [];
        }
    }
    async getSizeTableById(id) {
        try {
            const sizeTable = await this.sizeTableRepo.findOne({
                where: {
                    id
                }
            });
            if (!sizeTable) {
                throw new _common.NotFoundException(`Size table with ID ${id} not found`);
            }
            return this.sanitizeSizeTable(sizeTable);
        } catch (error) {
            console.error('Error getting size table by ID:', error);
            throw error;
        }
    }
    async updateSizeTable(id, updateDto) {
        try {
            const sizeTable = await this.sizeTableRepo.findOne({
                where: {
                    id
                }
            });
            if (!sizeTable) {
                throw new _common.NotFoundException(`Size table with ID ${id} not found`);
            }
            // Update table name if provided
            if (updateDto.tableName !== undefined) {
                sizeTable.tableName = updateDto.tableName;
                sizeTable.data.tableName = updateDto.tableName;
            }
            // Update dimensions if provided
            if (updateDto.dimensions !== undefined) {
                sizeTable.data.dimensions = updateDto.dimensions;
            }
            const updatedSizeTable = await this.sizeTableRepo.save(sizeTable);
            return this.sanitizeSizeTable(updatedSizeTable);
        } catch (error) {
            console.error('Error updating size table:', error);
            throw error;
        }
    }
    async deleteSizeTable(id) {
        try {
            const sizeTable = await this.sizeTableRepo.findOne({
                where: {
                    id
                }
            });
            if (!sizeTable) {
                throw new _common.NotFoundException(`Size table with ID ${id} not found`);
            }
            await this.sizeTableRepo.remove(sizeTable);
        } catch (error) {
            console.error('Error deleting size table:', error);
            throw error;
        }
    }
    constructor(sizeTableRepo){
        this.sizeTableRepo = sizeTableRepo;
    }
};
SizeTableCrud = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_sizeTableentity.SizeTable)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], SizeTableCrud);

//# sourceMappingURL=size-table.crud.js.map