"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileStorageService", {
    enumerable: true,
    get: function() {
        return FileStorageService;
    }
});
const _common = require("@nestjs/common");
const _fs = require("fs");
const _path = require("path");
const _uuid = require("uuid");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FileStorageService = class FileStorageService {
    ensureDirectoryExists(dir) {
        if (!(0, _fs.existsSync)(dir)) {
            (0, _fs.mkdirSync)(dir, {
                recursive: true
            });
        }
    }
    /**
   * Save a file to storage and return the file path
   */ async saveFile(file, subDirectory = 'products') {
        const dir = (0, _path.join)(this.uploadDir, subDirectory);
        this.ensureDirectoryExists(dir);
        const uniqueFilename = `${(0, _uuid.v4)()}${(0, _path.extname)(file.originalname)}`;
        const filePath = (0, _path.join)(dir, uniqueFilename);
        // Use promisified version of writeFile
        await new Promise((resolve)=>{
            (0, _fs.writeFileSync)(filePath, file.buffer);
            resolve();
        });
        // Return relative path that can be used in URLs
        return `${subDirectory}/${uniqueFilename}`;
    }
    /**
   * Save multiple files to storage and return their paths
   */ async saveFiles(files, subDirectory = 'products') {
        return Promise.all(files.map((file)=>this.saveFile(file, subDirectory)));
    }
    /**
   * Get a file from storage
   */ getFile(filePath) {
        const fullPath = (0, _path.join)(this.uploadDir, filePath);
        if (!(0, _fs.existsSync)(fullPath)) {
            throw new _common.NotFoundException(`File ${filePath} not found`);
        }
        return (0, _fs.readFileSync)(fullPath);
    }
    /**
   * Delete a file from storage
   */ deleteFile(filePath) {
        if (!filePath) return false;
        const fullPath = (0, _path.join)(this.uploadDir, filePath);
        console.log('FileStorageService.deleteFile:', {
            originalPath: filePath,
            fullPath,
            exists: (0, _fs.existsSync)(fullPath)
        });
        if (!(0, _fs.existsSync)(fullPath)) return false;
        try {
            (0, _fs.unlinkSync)(fullPath);
            return true;
        } catch (error) {
            console.error(`Error deleting file ${filePath}:`, error);
            return false;
        }
    }
    /**
   * Delete multiple files from storage
   */ deleteFiles(filePaths) {
        if (!filePaths) return [];
        return filePaths.map((path)=>this.deleteFile(path));
    }
    /**
   * Get the full URL for a file path
   */ /**
   * Delete a directory and all its contents
   */ deleteDirectory(dirPath) {
        if (!dirPath) return false;
        const fullPath = (0, _path.join)(this.uploadDir, dirPath);
        console.log('FileStorageService.deleteDirectory:', {
            originalPath: dirPath,
            fullPath,
            exists: (0, _fs.existsSync)(fullPath)
        });
        if (!(0, _fs.existsSync)(fullPath)) return false;
        try {
            // Remove directory and all contents recursively
            (0, _fs.rmSync)(fullPath, {
                recursive: true,
                force: true
            });
            return true;
        } catch (error) {
            console.error(`Error deleting directory ${dirPath}:`, error);
            return false;
        }
    }
    getFileUrl(filePath, req) {
        if (!filePath) return '';
        // If the path is already a full URL, return it
        if (filePath.startsWith('http')) {
            return filePath;
        }
        // If request object is provided, construct full URL
        if (req) {
            const protocol = req.protocol;
            const host = req.get('host');
            return `${protocol}://${host}/${this.uploadDir}/${filePath}`;
        }
        // Otherwise return relative path
        return `/${this.uploadDir}/${filePath}`;
    }
    constructor(){
        this.uploadDir = 'uploads';
        this.productImagesDir = (0, _path.join)(this.uploadDir, 'products');
        // Ensure upload directories exist
        this.ensureDirectoryExists(this.uploadDir);
        this.ensureDirectoryExists(this.productImagesDir);
    }
};
FileStorageService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], FileStorageService);

//# sourceMappingURL=file-storage.service.js.map