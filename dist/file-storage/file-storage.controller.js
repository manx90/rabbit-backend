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
    constructor(fileStorageService){
        this.fileStorageService = fileStorageService;
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
FileStorageController = _ts_decorate([
    (0, _common.Controller)('uploads'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService
    ])
], FileStorageController);

//# sourceMappingURL=file-storage.controller.js.map