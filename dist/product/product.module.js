"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductModule", {
    enumerable: true,
    get: function() {
        return ProductModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _loggerservice = require("../common/utils/logger.service");
const _filestoragemodule = require("../file-storage/file-storage.module");
const _categorycontroller = require("./category.controller");
const _categoryservice = require("./category.service");
const _Categoryentity = require("./entities/Category.entity");
const _productcollectionentity = require("./entities/product-collection.entity");
const _productentity = require("./entities/product.entity");
const _productcollectioncontroller = require("./product-collection.controller");
const _productcollectionservice = require("./product-collection.service");
const _productcontroller = require("./product.controller");
const _productcrud = require("./product.crud");
const _productservice = require("./product.service");
const _sizetablecontroller = require("./size-table.controller");
const _sizetableservice = require("./size-table.service");
const _sizetablecrud = require("./size-table.crud");
const _sizeTableentity = require("./entities/sizeTable.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ProductModule = class ProductModule {
};
ProductModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _productentity.product,
                _Categoryentity.category,
                _Categoryentity.subCategory,
                _productcollectionentity.ProductCollection,
                _productservice.ProductService,
                _sizeTableentity.SizeTable
            ]),
            _filestoragemodule.FileStorageModule
        ],
        controllers: [
            _productcontroller.ProductController,
            _categorycontroller.CategoryController,
            _productcollectioncontroller.ProductCollectionController,
            _sizetablecontroller.SizeTableController
        ],
        providers: [
            _productservice.ProductService,
            _productcrud.ProductCrud,
            _categoryservice.CategoryService,
            _productcollectionservice.ProductCollectionService,
            _loggerservice.LoggerService,
            _sizetableservice.SizeTableService,
            _sizetablecrud.SizeTableCrud
        ],
        exports: [
            _productservice.ProductService,
            _productcrud.ProductCrud,
            _categoryservice.CategoryService,
            _productcollectionservice.ProductCollectionService,
            _sizetableservice.SizeTableService,
            _sizetablecrud.SizeTableCrud
        ]
    })
], ProductModule);

//# sourceMappingURL=product.module.js.map