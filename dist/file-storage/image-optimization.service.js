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
const _sharp = /*#__PURE__*/ _interop_require_default(require("sharp"));
const _fsextra = /*#__PURE__*/ _interop_require_wildcard(require("fs-extra"));
const _path = /*#__PURE__*/ _interop_require_wildcard(require("path"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ImageOptimizationService = class ImageOptimizationService {
    /**
   * Optimize a single image file
   */ async optimizeImage(inputPath, outputPath, options = {}) {
        // In production mode, skip heavy optimization to save memory
        if (this.isProduction) {
            this.logger.log(`Skipping image optimization in production mode for: ${inputPath}`);
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
        // Start with default options
        const opts = _object_spread({}, this.defaultOptions, options);
        // Create backup path - preserve directory structure
        const relativePath = _path.relative('uploads', inputPath);
        const backupPath = _path.join('uploads_backup', relativePath);
        // Create optimized file path in separate folder
        const optimizedPath = _path.join('uploads_optimized', relativePath);
        const finalOutputPath = outputPath || optimizedPath;
        try {
            // Create backup directory and copy original file
            await _fsextra.ensureDir(_path.dirname(backupPath));
            await _fsextra.copy(inputPath, backupPath);
            // Get original file stats
            const originalStats = await _fsextra.stat(inputPath);
            const originalSize = originalStats.size;
            // Check if this is a sizechart or measure image - skip compression for these
            const isSizechartOrMeasure = inputPath.includes('sizechart') || inputPath.includes('measure');
            if (isSizechartOrMeasure) {
                // Don't compress sizechart or measure images - keep original quality
                opts.quality = 100;
                this.logger.log(`Skipping compression for ${_path.basename(inputPath)} (sizechart/measure)`);
            } else {
                // Dynamically set quality based on file size
                // If file is less than 150KB, use 50% quality
                // If file is 150KB or larger, use 30% quality
                const sizeInKB = originalSize / 1024;
                if (!options.quality) {
                    // Only override if not explicitly set
                    if (sizeInKB < 150) {
                        opts.quality = 50; // Moderate compression for smaller files
                    } else {
                        opts.quality = 30; // Higher compression for larger files
                    }
                }
            }
            // Read the image
            const image = (0, _sharp.default)(inputPath);
            // Apply transformations without resizing
            let processedImage = image;
            // Apply format-specific optimizations
            switch(opts.format){
                case 'jpeg':
                    processedImage = processedImage.jpeg({
                        quality: opts.quality,
                        progressive: opts.progressive,
                        mozjpeg: true
                    });
                    break;
                case 'png':
                    processedImage = processedImage.png({
                        quality: opts.quality,
                        progressive: opts.progressive,
                        compressionLevel: 9
                    });
                    break;
                case 'webp':
                    processedImage = processedImage.webp({
                        quality: opts.quality,
                        effort: 6
                    });
                    break;
                case 'avif':
                    processedImage = processedImage.avif({
                        quality: opts.quality,
                        effort: 6
                    });
                    break;
            }
            // Ensure output directory exists
            await _fsextra.ensureDir(_path.dirname(finalOutputPath));
            // Save optimized image to optimized folder
            await processedImage.toFile(finalOutputPath);
            // Get optimized file stats
            const optimizedStats = await _fsextra.stat(finalOutputPath);
            const optimizedSize = optimizedStats.size;
            const reductionPercentage = (originalSize - optimizedSize) / originalSize * 100;
            this.logger.log(`Optimized: ${_path.basename(inputPath)} - ${originalSize}KB → ${optimizedSize}KB (${reductionPercentage.toFixed(1)}% reduction)`);
            // No need to replace original - optimized file is saved separately
            return {
                originalSize,
                optimizedSize,
                reductionPercentage,
                originalPath: inputPath,
                optimizedPath: finalOutputPath,
                backupPath: backupPath,
                success: true
            };
        } catch (error) {
            this.logger.error(`Failed to optimize ${inputPath}: ${error.message}`);
            // No cleanup needed - optimized files are saved separately
            return {
                originalSize: 0,
                optimizedSize: 0,
                reductionPercentage: 0,
                originalPath: inputPath,
                optimizedPath: finalOutputPath,
                backupPath: backupPath,
                success: false,
                error: error.message
            };
        }
    }
    /**
   * Optimize a buffer (for new uploads)
   */ async optimizeBuffer(buffer, options = {}) {
        const opts = _object_spread({}, this.defaultOptions, options);
        try {
            let processedImage = (0, _sharp.default)(buffer);
            // Apply transformations without resizing
            processedImage = processedImage;
            // Apply format-specific optimizations
            switch(opts.format){
                case 'jpeg':
                    processedImage = processedImage.jpeg({
                        quality: opts.quality,
                        progressive: opts.progressive,
                        mozjpeg: true
                    });
                    break;
                case 'png':
                    processedImage = processedImage.png({
                        quality: opts.quality,
                        progressive: opts.progressive,
                        compressionLevel: 9
                    });
                    break;
                case 'webp':
                    processedImage = processedImage.webp({
                        quality: opts.quality,
                        effort: 6
                    });
                    break;
                case 'avif':
                    processedImage = processedImage.avif({
                        quality: opts.quality,
                        effort: 6
                    });
                    break;
            }
            return await processedImage.toBuffer();
        } catch (error) {
            this.logger.error(`Failed to optimize buffer: ${error.message}`);
            throw error;
        }
    }
    /**
   * Batch optimize all images in a directory
   */ async optimizeDirectory(directoryPath, options = {}, recursive = true) {
        const results = [];
        try {
            // Use fs-extra to find all image files recursively
            const findImageFiles = async (dir)=>{
                const files = [];
                const items = await _fsextra.readdir(dir);
                for (const item of items){
                    const fullPath = _path.join(dir, item);
                    const stat = await _fsextra.stat(fullPath);
                    if (stat.isDirectory() && recursive) {
                        const subFiles = await findImageFiles(fullPath);
                        files.push(...subFiles);
                    } else if (stat.isFile()) {
                        const ext = _path.extname(item).toLowerCase();
                        if ([
                            '.jpg',
                            '.jpeg',
                            '.png',
                            '.webp'
                        ].includes(ext)) {
                            files.push(fullPath);
                        }
                    }
                }
                return files;
            };
            const files = await findImageFiles(directoryPath);
            this.logger.log(`Found ${files.length} images to optimize in ${directoryPath}`);
            for (const file of files){
                const result = await this.optimizeImage(file, undefined, options);
                results.push(result);
            }
            // Log summary
            const successful = results.filter((r)=>r.success);
            const totalOriginalSize = successful.reduce((sum, r)=>sum + r.originalSize, 0);
            const totalOptimizedSize = successful.reduce((sum, r)=>sum + r.optimizedSize, 0);
            const averageReduction = successful.length > 0 ? successful.reduce((sum, r)=>sum + r.reductionPercentage, 0) / successful.length : 0;
            this.logger.log(`Batch optimization complete: ${successful.length}/${files.length} successful, ` + `${(totalOriginalSize / 1024).toFixed(1)}KB → ${(totalOptimizedSize / 1024).toFixed(1)}KB ` + `(${averageReduction.toFixed(1)}% average reduction)`);
        } catch (error) {
            this.logger.error(`Failed to optimize directory ${directoryPath}: ${error.message}`);
        }
        return results;
    }
    /**
   * Optimize all images in the uploads folder
   */ async optimizeAllUploads(options = {}) {
        const uploadsPath = 'uploads';
        if (!await _fsextra.pathExists(uploadsPath)) {
            this.logger.warn('Uploads directory does not exist');
            return [];
        }
        this.logger.log('Starting optimization of all uploads...');
        return await this.optimizeDirectory(uploadsPath, options, true);
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
        this.defaultOptions = {
            quality: 50,
            format: 'jpeg',
            progressive: true
        };
    }
};
ImageOptimizationService = _ts_decorate([
    (0, _common.Injectable)()
], ImageOptimizationService);

//# sourceMappingURL=image-optimization.service.js.map