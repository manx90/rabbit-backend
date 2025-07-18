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
const _productcontroller = require("./product.controller");
const _productservice = require("./product.service");
const _categorycontroller = require("./category.controller");
const _categoryservice = require("./category.service");
const _productentity = require("./entities/product.entity");
const _Categoryentity = require("./entities/Category.entity");
const _filestoragemodule = require("../file-storage/file-storage.module");
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
                _Categoryentity.subCategory
            ]),
            _filestoragemodule.FileStorageModule
        ],
        controllers: [
            _productcontroller.ProductController,
            _categorycontroller.CategoryController
        ],
        providers: [
            _productservice.ProductService,
            _categoryservice.CategoryService
        ],
        exports: [
            _productservice.ProductService,
            _categoryservice.CategoryService
        ]
    })
], ProductModule);

//# sourceMappingURL=product.module.js.map