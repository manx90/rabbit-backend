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
const _sizeTable = require("./entities/sizeTable");
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
    async createSizeTable(tableData) {
        const sizeTable = this.sizeTableRepo.create({
            tableName: tableData.tableName
        });
        const savedTable = await this.sizeTableRepo.save(sizeTable);
        // Create size dimensions if provided
        if (tableData.sizeDimensions && tableData.sizeDimensions.length > 0) {
            for (const sizeDim of tableData.sizeDimensions){
                const sizeDimension = this.sizeDimensionRepo.create({
                    sizeName: sizeDim.sizeName,
                    sizeTable: savedTable
                });
                const savedDimension = await this.sizeDimensionRepo.save(sizeDimension);
                // Create fields if provided
                if (sizeDim.fields && sizeDim.fields.length > 0) {
                    for (const field of sizeDim.fields){
                        await this.sizeFieldRepo.save({
                            fieldName: field.fieldName,
                            fieldValue: field.fieldValue,
                            sizeDimension: savedDimension
                        });
                    }
                }
            }
        }
        return await this.sizeTableRepo.findOne({
            where: {
                id: savedTable.id
            },
            relations: [
                'sizeDimensions',
                'sizeDimensions.fields'
            ]
        });
    }
    async getAllSizeTables() {
        return await this.sizeTableRepo.find({
            relations: [
                'sizeDimensions',
                'sizeDimensions.fields'
            ],
            order: {
                id: 'ASC'
            }
        });
    }
    async getSizeTableById(id) {
        const sizeTable = await this.sizeTableRepo.findOne({
            where: {
                id
            },
            relations: [
                'sizeDimensions',
                'sizeDimensions.fields'
            ]
        });
        if (!sizeTable) {
            throw new _common.NotFoundException(`Size table with ID ${id} not found`);
        }
        return sizeTable;
    }
    async updateSizeTable(id, updateData) {
        const sizeTable = await this.sizeTableRepo.findOne({
            where: {
                id
            }
        });
        if (!sizeTable) {
            throw new _common.NotFoundException(`Size table with ID ${id} not found`);
        }
        Object.assign(sizeTable, updateData);
        return await this.sizeTableRepo.save(sizeTable);
    }
    async deleteSizeTable(id) {
        const sizeTable = await this.sizeTableRepo.findOne({
            where: {
                id
            }
        });
        if (!sizeTable) {
            throw new _common.NotFoundException(`Size table with ID ${id} not found`);
        }
        await this.sizeTableRepo.remove(sizeTable);
    }
    async addSizeDimension(tableId, sizeData) {
        const sizeTable = await this.sizeTableRepo.findOne({
            where: {
                id: tableId
            }
        });
        if (!sizeTable) {
            throw new _common.NotFoundException(`Size table with ID ${tableId} not found`);
        }
        const sizeDimension = this.sizeDimensionRepo.create({
            sizeName: sizeData.sizeName,
            sizeTable
        });
        const savedDimension = await this.sizeDimensionRepo.save(sizeDimension);
        // Create fields if provided
        if (sizeData.fields && sizeData.fields.length > 0) {
            for (const field of sizeData.fields){
                await this.sizeFieldRepo.save({
                    fieldName: field.fieldName,
                    fieldValue: field.fieldValue,
                    sizeDimension: savedDimension
                });
            }
        }
        return await this.sizeDimensionRepo.findOne({
            where: {
                id: savedDimension.id
            },
            relations: [
                'fields'
            ]
        });
    }
    constructor(sizeTableRepo, sizeDimensionRepo, sizeFieldRepo){
        this.sizeTableRepo = sizeTableRepo;
        this.sizeDimensionRepo = sizeDimensionRepo;
        this.sizeFieldRepo = sizeFieldRepo;
    }
};
SizeTableCrud = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_sizeTable.SizeTable)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_sizeTable.SizeDimension)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_sizeTable.SizeField)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], SizeTableCrud);

//# sourceMappingURL=size-table.crud.js.map