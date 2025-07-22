/* eslint-disable @typescript-eslint/no-unsafe-call */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileStorageModule", {
    enumerable: true,
    get: function() {
        return FileStorageModule;
    }
});
const _common = require("@nestjs/common");
const _filestorageservice = require("./file-storage.service");
const _filestoragecontroller = require("./file-storage.controller");
const _imageoptimizationservice = require("./image-optimization.service");
const _platformexpress = require("@nestjs/platform-express");
const _multer = require("multer");
const _path = require("path");
const _uuid = require("uuid");
const _servestatic = require("@nestjs/serve-static");
const _fs = require("fs");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FileStorageModule = class FileStorageModule {
};
FileStorageModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _platformexpress.MulterModule.register({
                storage: (0, _multer.diskStorage)({
                    destination: (req, file, cb)=>{
                        var _req_body;
                        // Get product name from the request body
                        const productName = ((_req_body = req.body) === null || _req_body === void 0 ? void 0 : _req_body.createProductDto) ? JSON.parse(req.body.createProductDto).name.replace(/\s+/g, '_').toLowerCase() : 'temp';
                        // Create base uploads directory if it doesn't exist
                        const baseDir = './uploads';
                        if (!(0, _fs.existsSync)(baseDir)) {
                            (0, _fs.mkdirSync)(baseDir, {
                                recursive: true
                            });
                        }
                        // Create product-specific directory
                        const productDir = (0, _path.join)(baseDir, 'products', productName);
                        if (!(0, _fs.existsSync)(productDir)) {
                            (0, _fs.mkdirSync)(productDir, {
                                recursive: true
                            });
                        }
                        // Create subdirectories based on file field name
                        const fieldName = file.fieldname;
                        let uploadPath = productDir;
                        if (fieldName === 'imgCover') {
                            uploadPath = (0, _path.join)(productDir, 'cover');
                        } else if (fieldName === 'imgSizeChart') {
                            uploadPath = (0, _path.join)(productDir, 'sizechart');
                        } else if (fieldName === 'imgMeasure') {
                            uploadPath = (0, _path.join)(productDir, 'measure');
                        } else if (fieldName === 'imgColors') {
                            uploadPath = (0, _path.join)(productDir, 'colors');
                        } else if (fieldName === 'images') {
                            uploadPath = (0, _path.join)(productDir, 'images');
                        }
                        if (!(0, _fs.existsSync)(uploadPath)) {
                            (0, _fs.mkdirSync)(uploadPath, {
                                recursive: true
                            });
                        }
                        cb(null, uploadPath);
                    },
                    filename: (req, file, cb)=>{
                        const uniqueSuffix = (0, _uuid.v4)();
                        const ext = (0, _path.extname)(file.originalname);
                        cb(null, `${uniqueSuffix}${ext}`);
                    }
                }),
                limits: {
                    fileSize: 10 * 1024 * 1024
                }
            }),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            _servestatic.ServeStaticModule.forRoot({
                rootPath: (0, _path.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads'
            })
        ],
        controllers: [
            _filestoragecontroller.FileStorageController
        ],
        providers: [
            _filestorageservice.FileStorageService,
            _imageoptimizationservice.ImageOptimizationService
        ],
        exports: [
            _filestorageservice.FileStorageService,
            _imageoptimizationservice.ImageOptimizationService
        ]
    })
], FileStorageModule);

//# sourceMappingURL=file-storage.module.js.map