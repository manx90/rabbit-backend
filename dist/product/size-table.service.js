/* eslint-disable prettier/prettier */ /* eslint-disable @typescript-eslint/no-unsafe-return */ /* eslint-disable @typescript-eslint/no-unsafe-assignment */ /* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable @typescript-eslint/no-unsafe-call */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SizeTableService", {
    enumerable: true,
    get: function() {
        return SizeTableService;
    }
});
const _common = require("@nestjs/common");
const _sizetablecrud = require("./size-table.crud");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SizeTableService = class SizeTableService {
    async createSizeTable(createDto) {
        return await this.sizeTableCrud.createSizeTable(createDto);
    }
    async getAllSizeTables() {
        return await this.sizeTableCrud.getAllSizeTables();
    }
    async getSizeTableById(id) {
        return await this.sizeTableCrud.getSizeTableById(id);
    }
    async updateSizeTable(id, updateDto) {
        return await this.sizeTableCrud.updateSizeTable(id, updateDto);
    }
    async deleteSizeTable(id) {
        return await this.sizeTableCrud.deleteSizeTable(id);
    }
    async addSizeDimension(tableId, addDto) {
        return await this.sizeTableCrud.addSizeDimension(tableId, addDto);
    }
    constructor(sizeTableCrud){
        this.sizeTableCrud = sizeTableCrud;
    }
};
SizeTableService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _sizetablecrud.SizeTableCrud === "undefined" ? Object : _sizetablecrud.SizeTableCrud
    ])
], SizeTableService);

//# sourceMappingURL=size-table.service.js.map