/* eslint-disable no-self-assign */ /* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable @typescript-eslint/no-unsafe-assignment */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImageOptimizationService", {
    enumerable: true,
    get: function() {
        return ImageOptimizationService;
    }
});
const _common = require("@nestjs/common");
const _path = /*#__PURE__*/ _interop_require_wildcard(require("path"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ImageOptimizationService = class ImageOptimizationService {
    /**
   * Optimize a single image file - DISABLED to prevent WebAssembly memory issues
   */ async optimizeImage(inputPath, outputPath, options = {}) {
        // DISABLED: Image optimization completely disabled to prevent WebAssembly memory issues
        this.logger.log(`Image optimization disabled - returning original file: ${inputPath}`);
        return {
            originalSize: 0,
            optimizedSize: 0,
            reductionPercentage: 0,
            originalPath: inputPath,
            optimizedPath: inputPath,
            backupPath: inputPath,
            success: true
        };
    }
    /**
   * Optimize all images in a directory - DISABLED
   */ async optimizeDirectory(dirPath, options = {}, recursive = false) {
        // DISABLED: Image optimization completely disabled to prevent WebAssembly memory issues
        this.logger.log(`Image optimization disabled for directory: ${dirPath}`);
        return [];
    }
    /**
   * Optimize all images in the uploads folder - DISABLED
   */ async optimizeAllUploads(options = {}) {
        // DISABLED: Image optimization completely disabled to prevent WebAssembly memory issues
        this.logger.log('Image optimization disabled - returning empty results');
        return [];
    }
    /**
   * Optimize image buffer - DISABLED to prevent WebAssembly memory issues
   */ async optimizeBuffer(buffer, options = {}) {
        // DISABLED: Image optimization completely disabled to prevent WebAssembly memory issues
        this.logger.log('Image buffer optimization disabled - returning original buffer');
        return buffer;
    }
    /**
   * Get supported image formats
   */ getSupportedFormats() {
        return [
            'jpg',
            'jpeg',
            'png',
            'webp',
            'avif',
            'JPG',
            'JPEG',
            'PNG',
            'WEBP'
        ];
    }
    /**
   * Check if a file is a supported image format
   */ isSupportedImage(filename) {
        const ext = _path.extname(filename).toLowerCase().slice(1);
        return this.getSupportedFormats().includes(ext);
    }
    constructor(){
        this.logger = new _common.Logger(ImageOptimizationService.name);
        this.isProduction = process.env.NODE_ENV === 'production';
        this.isCPanelHosting = process.env.NODE_ENV === 'production' && process.env.MAX_MEMORY_USAGE;
    }
};
ImageOptimizationService = _ts_decorate([
    (0, _common.Injectable)()
], ImageOptimizationService);

//# sourceMappingURL=image-optimization.service.js.map