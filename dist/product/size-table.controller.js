/* eslint-disable prettier/prettier */ /* eslint-disable @typescript-eslint/no-unsafe-return */ /* eslint-disable @typescript-eslint/no-unsafe-assignment */ /* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable @typescript-eslint/no-unsafe-call */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SizeTableController", {
    enumerable: true,
    get: function() {
        return SizeTableController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _sizetableservice = require("./size-table.service");
const _sizetabledto = require("./dto/size-table.dto");
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
let SizeTableController = class SizeTableController {
    async createSizeTable(createDto) {
        return await this.sizeTableService.createSizeTable(createDto);
    }
    async getAllSizeTables() {
        return await this.sizeTableService.getAllSizeTables();
    }
    async getSizeTableById(id) {
        return await this.sizeTableService.getSizeTableById(id);
    }
    async updateSizeTable(id, updateDto) {
        return await this.sizeTableService.updateSizeTable(id, updateDto);
    }
    async deleteSizeTable(id) {
        return await this.sizeTableService.deleteSizeTable(id);
    }
    async addSizeDimension(tableId, addDto) {
        return await this.sizeTableService.addSizeDimension(tableId, addDto);
    }
    constructor(sizeTableService){
        this.sizeTableService = sizeTableService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new size table'
    }),
    (0, _swagger.ApiResponse)({
        status: _common.HttpStatus.CREATED,
        description: 'Size table created successfully',
        type: _sizeTable.SizeTable
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _sizetabledto.CreateSizeTableDto === "undefined" ? Object : _sizetabledto.CreateSizeTableDto
    ]),
    _ts_metadata("design:returntype", Promise)
], SizeTableController.prototype, "createSizeTable", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all size tables'
    }),
    (0, _swagger.ApiResponse)({
        status: _common.HttpStatus.OK,
        description: 'Size tables retrieved successfully',
        type: [
            _sizeTable.SizeTable
        ]
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], SizeTableController.prototype, "getAllSizeTables", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get size table by ID'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        description: 'Size table ID',
        type: 'number'
    }),
    (0, _swagger.ApiResponse)({
        status: _common.HttpStatus.OK,
        description: 'Size table retrieved successfully',
        type: _sizeTable.SizeTable
    }),
    (0, _swagger.ApiResponse)({
        status: _common.HttpStatus.NOT_FOUND,
        description: 'Size table not found'
    }),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], SizeTableController.prototype, "getSizeTableById", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Update size table'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        description: 'Size table ID',
        type: 'number'
    }),
    (0, _swagger.ApiResponse)({
        status: _common.HttpStatus.OK,
        description: 'Size table updated successfully',
        type: _sizeTable.SizeTable
    }),
    (0, _swagger.ApiResponse)({
        status: _common.HttpStatus.NOT_FOUND,
        description: 'Size table not found'
    }),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _sizetabledto.UpdateSizeTableDto === "undefined" ? Object : _sizetabledto.UpdateSizeTableDto
    ]),
    _ts_metadata("design:returntype", Promise)
], SizeTableController.prototype, "updateSizeTable", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.HttpCode)(_common.HttpStatus.NO_CONTENT),
    (0, _swagger.ApiOperation)({
        summary: 'Delete size table'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        description: 'Size table ID',
        type: 'number'
    }),
    (0, _swagger.ApiResponse)({
        status: _common.HttpStatus.NO_CONTENT,
        description: 'Size table deleted successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: _common.HttpStatus.NOT_FOUND,
        description: 'Size table not found'
    }),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], SizeTableController.prototype, "deleteSizeTable", null);
_ts_decorate([
    (0, _common.Post)(':id/size-dimensions'),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    (0, _swagger.ApiOperation)({
        summary: 'Add a size dimension to a size table'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        description: 'Size table ID',
        type: 'number'
    }),
    (0, _swagger.ApiResponse)({
        status: _common.HttpStatus.CREATED,
        description: 'Size dimension added successfully',
        type: _sizeTable.SizeDimension
    }),
    (0, _swagger.ApiResponse)({
        status: _common.HttpStatus.NOT_FOUND,
        description: 'Size table not found'
    }),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _sizetabledto.AddSizeDimensionDto === "undefined" ? Object : _sizetabledto.AddSizeDimensionDto
    ]),
    _ts_metadata("design:returntype", Promise)
], SizeTableController.prototype, "addSizeDimension", null);
SizeTableController = _ts_decorate([
    (0, _swagger.ApiTags)('Size Tables'),
    (0, _common.Controller)('size-tables'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _sizetableservice.SizeTableService === "undefined" ? Object : _sizetableservice.SizeTableService
    ])
], SizeTableController);

//# sourceMappingURL=size-table.controller.js.map