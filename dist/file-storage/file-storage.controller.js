/* eslint-disable @typescript-eslint/no-unused-vars */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileStorageController", {
    enumerable: true,
    get: function() {
        return FileStorageController;
    }
});
const _common = require("@nestjs/common");
const _express = require("express");
const _path = require("path");
const _filestorageservice = require("./file-storage.service");
const _imageoptimizationservice = require("./image-optimization.service");
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
let FileStorageController = class FileStorageController {
    getFile(subdir, filename, res) {
        try {
            const filePath = (0, _path.join)(subdir, filename);
            const file = this.fileStorageService.getFile(filePath);
            // Determine content type based on file extension
            const ext = filename.split('.').pop();
            const contentTypes = {
                png: 'image/png',
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                gif: 'image/gif',
                webp: 'image/webp',
                pdf: 'application/pdf'
            };
            const contentType = ext && contentTypes[ext.toLowerCase()] || 'application/octet-stream';
            res.type(contentType).send(file);
        } catch (_error) {
            res.status(404).send('File not found');
        }
    }
    async optimizeAllImages(options) {
        const results = await this.imageOptimizationService.optimizeAllUploads(options);
        const successful = results.filter((r)=>r.success);
        const failed = results.filter((r)=>!r.success);
        const totalOriginalSize = successful.reduce((sum, r)=>sum + r.originalSize, 0);
        const totalOptimizedSize = successful.reduce((sum, r)=>sum + r.optimizedSize, 0);
        const totalSaved = totalOriginalSize - totalOptimizedSize;
        const averageReduction = successful.length > 0 ? successful.reduce((sum, r)=>sum + r.reductionPercentage, 0) / successful.length : 0;
        return {
            message: 'Image optimization completed',
            summary: {
                totalProcessed: results.length,
                successful: successful.length,
                failed: failed.length,
                totalOriginalSizeMB: (totalOriginalSize / 1024 / 1024).toFixed(2),
                totalOptimizedSizeMB: (totalOptimizedSize / 1024 / 1024).toFixed(2),
                totalSavedMB: (totalSaved / 1024 / 1024).toFixed(2),
                averageReduction: averageReduction.toFixed(1) + '%'
            },
            results: results.slice(0, 10)
        };
    }
    constructor(fileStorageService, imageOptimizationService){
        this.fileStorageService = fileStorageService;
        this.imageOptimizationService = imageOptimizationService;
    }
};
_ts_decorate([
    (0, _common.Get)(':subdir/:filename'),
    _ts_param(0, (0, _common.Param)('subdir')),
    _ts_param(1, (0, _common.Param)('filename')),
    _ts_param(2, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", void 0)
], FileStorageController.prototype, "getFile", null);
_ts_decorate([
    (0, _common.Post)('optimize'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _imageoptimizationservice.OptimizationOptions === "undefined" ? Object : _imageoptimizationservice.OptimizationOptions
    ]),
    _ts_metadata("design:returntype", Promise)
], FileStorageController.prototype, "optimizeAllImages", null);
FileStorageController = _ts_decorate([
    (0, _common.Controller)('uploads'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _imageoptimizationservice.ImageOptimizationService === "undefined" ? Object : _imageoptimizationservice.ImageOptimizationService
    ])
], FileStorageController);

//# sourceMappingURL=file-storage.controller.js.map