/* eslint-disable prettier/prettier */ /* eslint-disable @typescript-eslint/no-unsafe-return */ /* eslint-disable @typescript-eslint/no-unsafe-assignment */ /* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable @typescript-eslint/no-unsafe-call */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductService", {
    enumerable: true,
    get: function() {
        return ProductService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _productentity = require("./entities/product.entity");
const _Categoryentity = require("./entities/Category.entity");
const _entityinterface = require("../common/interfaces/entity.interface");
const _apifeatures = require("../common/utils/api-features");
const _filestorageservice = require("../file-storage/file-storage.service");
const _config = require("@nestjs/config");
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
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
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
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ProductService = class ProductService {
    /**
   * Save files to storage and return their paths
   * This replaces the old mapFiles method that converted to base64
   */ async saveFiles(files = [], productName, subDirectory) {
        const productPath = `products/${productName.replace(/\s+/g, '_').toLowerCase()}/${subDirectory}`;
        return await this.fileStorageService.saveFiles(files, productPath, {
            quality: 50,
            format: 'jpeg',
            progressive: true
        });
    }
    /**
   * Save a single file to storage and return its path
   */ async saveFile(file, productName, subDirectory) {
        const productPath = `products/${productName.replace(/\s+/g, '_').toLowerCase()}/${subDirectory}`;
        // Skip compression for sizechart and measure files
        if (subDirectory === 'sizechart' || subDirectory === 'measure') {
            // Don't compress these files - keep original quality
            return await this.fileStorageService.saveFile(file, productPath, {
                quality: 100,
                format: 'jpeg',
                progressive: true
            });
        } else {
            return await this.fileStorageService.saveFile(file, productPath, {
                quality: 50,
                format: 'jpeg',
                progressive: true
            });
        }
    }
    async uploadFiles(files, productName) {
        const result = {};
        if (files.images && files.images.length > 0) {
            result.images = await this.saveFiles(files.images, productName, 'images');
        }
        if (files.imgCover && files.imgCover.length > 0) {
            result.imgCover = await this.saveFile(files.imgCover[0], productName, 'cover');
        }
        if (files.imgSizeChart && files.imgSizeChart.length > 0) {
            result.imgSizeChart = await this.saveFile(files.imgSizeChart[0], productName, 'size-chart');
        }
        if (files.imgMeasure && files.imgMeasure.length > 0) {
            result.imgMeasure = await this.saveFile(files.imgMeasure[0], productName, 'measure');
        }
        if (files.imgColors && files.imgColors.length > 0) {
            result.imgColors = await this.saveFiles(files.imgColors, productName, 'colors');
        }
        return result;
    }
    /**
   * Transform product file paths to full URLs
   * @param products Array of product entities
   * @param req Express Request object
   * @returns Products with transformed URLs
   */ transformProductUrls(products, req) {
        const protocol = req.protocol || 'http';
        const host = req.get('host') || 'localhost:3000';
        const baseUrl = `${protocol}://${host}`;
        return products.map((product)=>{
            // Create a clone of the product to avoid modifying the original
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const transformed = Object.create(Object.getPrototypeOf(product), Object.getOwnPropertyDescriptors(product));
            // Transform image cover URL
            if (transformed.imgCover && !transformed.imgCover.startsWith('http')) {
                transformed.imgCover = `${baseUrl}/uploads/${transformed.imgCover}`;
            }
            // Transform size chart image URL
            if (transformed.imgSizeChart && !transformed.imgSizeChart.startsWith('http')) {
                transformed.imgSizeChart = `${baseUrl}/uploads/${transformed.imgSizeChart}`;
            }
            // Transform measure image URL
            if (transformed.imgMeasure && !transformed.imgMeasure.startsWith('http')) {
                transformed.imgMeasure = `${baseUrl}/uploads/${transformed.imgMeasure}`;
            }
            // Transform product images URLs
            if (transformed.images && Array.isArray(transformed.images)) {
                transformed.images = transformed.images.map((img)=>img && !img.startsWith('http') ? `${baseUrl}/uploads/${img}` : img);
            }
            // Transform color images URLs
            if (transformed.colors && Array.isArray(transformed.colors)) {
                transformed.colors = transformed.colors.map((color)=>_object_spread_props(_object_spread({}, color), {
                        imgColor: color.imgColor && !color.imgColor.startsWith('http') ? `${baseUrl}/uploads/${color.imgColor}` : color.imgColor
                    }));
            }
            return transformed;
        });
    }
    /** ----------  Get All Products  ---------- */ async getAllProducts(query, req) {
        const queryBuilder = this.productRepo.createQueryBuilder('product').leftJoinAndSelect('product.category', 'category').leftJoinAndSelect('product.subCategory', 'subCategory').leftJoinAndSelect('product.poster', 'auth').select([
            'product',
            'category.id',
            'category.name',
            'subCategory.name',
            'subCategory.id',
            'auth.username'
        ]);
        const features = new _apifeatures.ApiFeatures(queryBuilder, query || {}, this.productRepo.metadata).filter().sort().paginate();
        const [data, total] = await features.getManyAndCount();
        const transformedData = req ? this.transformProductUrls(data, req) : data;
        const pagination = features.getPaginationInfo();
        return {
            status: 'success',
            results: transformedData.length,
            total,
            currentPage: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(total / pagination.limit),
            lastPage: Math.ceil(total / pagination.limit),
            data: transformedData
        };
    }
    async create(dto, files = {}, poster, req) {
        // 1) بناء الكيان الأساسي
        const Product = new _productentity.product();
        const existingProduct = await this.productRepo.findOne({
            where: {
                name: dto.name
            }
        });
        if (existingProduct) throw new _common.BadRequestException('Product name already exists');
        Product.name = dto.name;
        Product.description = dto.description;
        Product.poster = {
            id: poster.id,
            username: poster.username
        };
        Product.category = await this.fetchCategory(dto.categoryId);
        Product.subCategory = await this.fetchSubCategory(dto.categoryId, dto.subCategoryId);
        Product.publishState = dto.publishState;
        // 2) Save images to file system and store paths in database
        try {
            var _dto_colors;
            // Initialize image fields
            Product.imgCover = '';
            Product.imgSizeChart = '';
            Product.imgMeasure = '';
            Product.images = [];
            // Save cover image if provided
            if (files.imgCover && files.imgCover[0]) {
                Product.imgCover = await this.saveFile(files.imgCover[0], dto.name, 'cover');
            }
            // Save size chart image if provided
            if (files.imgSizeChart && files.imgSizeChart[0]) {
                Product.imgSizeChart = await this.saveFile(files.imgSizeChart[0], dto.name, 'sizechart');
            }
            // Save measure image if provided
            if (files.imgMeasure && files.imgMeasure[0]) {
                Product.imgMeasure = await this.saveFile(files.imgMeasure[0], dto.name, 'measure');
            }
            // Validate that the count of color images matches the count of color names
            if (files.imgColors && files.imgColors.length !== ((_dto_colors = dto.colors) === null || _dto_colors === void 0 ? void 0 : _dto_colors.length)) {
                throw new _common.BadRequestException('The count of color images must match the count of color names', 'COLORS_AND_IMAGES_COUNT_DO_NOT_MATCH');
            }
            // Save gallery images if provided
            if (files.images && files.images.length > 0) {
                Product.images = await this.saveFiles(files.images, dto.name, 'images');
            }
        } catch (error) {
            console.error('Error saving images:', error);
            throw new Error('Failed to save product images');
        }
        // Save color images to file system and validate
        if (files.imgColors && files.imgColors.length > 0) {
            if (!dto.colors || !Array.isArray(dto.colors)) {
                throw new _common.BadRequestException('Colors array is required when uploading color images');
            }
            // Save all color images first
            const colorImagePaths = await this.saveFiles(files.imgColors, dto.name, 'colors');
            // Map color images to colors array
            Product.colors = colorImagePaths.map((imgPath, index)=>({
                    name: dto.colors && dto.colors[index] ? dto.colors[index].name : `Color ${index + 1}`,
                    imgColor: imgPath
                }));
        } else if (dto.colors && Array.isArray(dto.colors)) {
            // Handle colors without images
            Product.colors = dto.colors.map((color)=>({
                    name: color.name,
                    imgColor: ''
                }));
        }
        // 3) Categories
        Product.category = await this.fetchCategory(dto.categoryId);
        Product.subCategory = await this.fetchSubCategory(dto.categoryId, dto.subCategoryId);
        // Poster is already assigned in the initial setup
        // 6) Size Details
        // Validate that color names in quantities match the defined colors
        if (dto.sizes && Array.isArray(dto.sizes) && dto.colors && Array.isArray(dto.colors)) {
            const colorNames = dto.colors.map((color)=>color.name);
            const sizeColorNames = new Set();
            // Collect all color names used in sizes
            for (const size of dto.sizes){
                for (const colorQty of size.quantities){
                    sizeColorNames.add(colorQty.colorName);
                }
            }
            // Convert set to array for comparison
            const uniqueSizeColorNames = Array.from(sizeColorNames);
            // Check if the count and names match exactly
            if (uniqueSizeColorNames.length !== colorNames.length) {
                throw new _common.BadRequestException('Number of colors in sizes does not match the number of colors defined in the colors list');
            }
            // Check if all colors in sizes exist in colors array and vice versa
            for (const colorName of uniqueSizeColorNames){
                if (!colorNames.includes(colorName)) {
                    throw new _common.BadRequestException(`Color "${colorName}" used in sizes is not defined in the colors list`);
                }
            }
            for (const colorName of colorNames){
                if (!uniqueSizeColorNames.includes(colorName)) {
                    throw new _common.BadRequestException(`Color "${colorName}" defined in colors list is not used in any size`);
                }
            }
        }
        //  Date Published
        if (dto.datePublished) {
            Product.datePublished = dto.datePublished;
            Product.publishState = _entityinterface.PublishState.DRAFT;
        }
        Product.sizeDetails = dto.sizes.map((size)=>({
                sizeName: size.sizeName,
                price: size.price,
                quantities: size.quantities.map((colorQty)=>({
                        colorName: colorQty.colorName,
                        quantity: colorQty.quantity
                    }))
            }));
        if (dto.wordKeys) Product.wordKeys = dto.wordKeys;
        if (dto.videoLink) Product.videoLink = dto.videoLink;
        if (dto.season) Product.season = dto.season;
        // Calculate total quantity
        Product.quantity = Product.getTotalQuantity();
        try {
            // Save the product to database
            const savedProduct = await this.productRepo.save(Product);
            // Transform file paths to full URLs if request object is provided
            if (req) {
                const [transformedProduct] = this.transformProductUrls([
                    savedProduct
                ], req);
                return transformedProduct;
            }
            return savedProduct;
        } catch (error) {
            console.error('Error saving product:', error);
            throw new Error('Failed to save product');
        }
    }
    /** ----------  Update  ---------- */ async update(id, dto, files = {}, req) {
        const product = await this.productRepo.findOne({
            where: {
                id
            },
            relations: [
                'category',
                'subCategory',
                'poster'
            ]
        });
        if (!product) throw new _common.NotFoundException('Product not found');
        if (dto.name) product.name = dto.name;
        if (dto.description) product.description = dto.description;
        if (dto.categoryId) product.category = await this.fetchCategory(dto.categoryId);
        if (dto.subCategoryId) product.subCategory = await this.fetchSubCategory(dto.categoryId, dto.subCategoryId);
        if (dto.publishState) product.publishState = dto.publishState;
        // Update files if provided - save to file system and handle old files properly
        try {
            // Handle product images (multiple files)
            if (files.images && files.images.length > 0) {
                // Delete old images if they exist
                if (product.images && product.images.length > 0) {
                    this.fileStorageService.deleteFiles(product.images);
                }
                // Save new images
                product.images = await this.saveFiles(files.images, product.name, 'images');
            }
            // Handle product cover image (single file)
            if (files.imgCover && files.imgCover[0]) {
                // Delete old cover image if it exists
                if (product.imgCover) {
                    this.fileStorageService.deleteFile(product.imgCover);
                }
                // Save new cover image
                product.imgCover = await this.saveFile(files.imgCover[0], product.name, 'cover');
            }
            // Handle size chart image (single file)
            if (files.imgSizeChart && files.imgSizeChart[0]) {
                // Delete old size chart image if it exists
                if (product.imgSizeChart) {
                    this.fileStorageService.deleteFile(product.imgSizeChart);
                }
                // Save new size chart image
                product.imgSizeChart = await this.saveFile(files.imgSizeChart[0], product.name, 'sizechart');
            }
            // Handle measure image (single file)
            if (files.imgMeasure && files.imgMeasure[0]) {
                // Delete old measure image if it exists
                if (product.imgMeasure) {
                    this.fileStorageService.deleteFile(product.imgMeasure);
                }
                // Save new measure image
                product.imgMeasure = await this.saveFile(files.imgMeasure[0], product.name, 'measure');
            }
        } catch (error) {
            console.error('Error handling product files:', error);
            throw new Error(`Failed to process product files: ${error.message}`);
        }
        // Update category and subcategory if provided
        if (dto.categoryId) product.category = await this.fetchCategory(dto.categoryId);
        if (dto.subCategoryId && dto.categoryId) product.subCategory = await this.fetchSubCategory(dto.categoryId, dto.subCategoryId);
        // Update size details if provided
        if (dto.sizes && dto.sizes.length > 0) {
            product.sizeDetails = dto.sizes.map((size, index)=>({
                    sizeName: size === null || size === void 0 ? void 0 : size.sizeName,
                    price: (size === null || size === void 0 ? void 0 : size.price) || product.sizeDetails[index].price,
                    quantities: (size === null || size === void 0 ? void 0 : size.quantities) ? size.quantities.map((q, index)=>({
                            colorName: q.colorName,
                            quantity: (q === null || q === void 0 ? void 0 : q.quantity) !== undefined ? q.quantity : product.sizeDetails[index].quantities[index].quantity
                        })) : product.sizeDetails[index].quantities
                }));
        }
        // Update colors if provided
        try {
            if (dto.colors && dto.colors.length > 0 && files.imgColors && files.imgColors.length > 0) {
                // Delete old color images if they exist
                if (product.colors && product.colors.length > 0) {
                    const oldColorImages = product.colors.map((color)=>color.imgColor).filter((imgPath)=>!!imgPath && imgPath.length > 0);
                    if (oldColorImages.length > 0) {
                        this.fileStorageService.deleteFiles(oldColorImages);
                    }
                }
                // Save new color images to file system
                const colorImagePaths = await this.saveFiles(files.imgColors, product.name, 'colors');
                product.colors = dto.colors.map((color, index)=>({
                        name: color.name || (product.colors && product.colors[index] ? product.colors[index].name : ''),
                        imgColor: colorImagePaths[index] || (product.colors && product.colors[index] ? product.colors[index].imgColor : '')
                    }));
            } else if (dto.colors && dto.colors.length > 0) {
                // Update color names but keep existing image paths
                product.colors = dto.colors.map((color, index)=>({
                        name: color.name || (product.colors && product.colors[index] ? product.colors[index].name : ''),
                        imgColor: product.colors && product.colors[index] ? product.colors[index].imgColor : ''
                    }));
            }
        } catch (error) {
            console.error('Error handling product color images:', error);
            throw new Error(`Failed to process product color images: ${error.message}`);
        }
        product.updatedAt = new Date();
        // Use update method for better efficiency (doesn't load entity, doesn't trigger hooks)
        await this.productRepo.update(id, product);
        // Fetch the updated product to return it
        const updatedProduct = await this.productRepo.findOne({
            where: {
                id
            },
            relations: [
                'category',
                'subCategory',
                'poster'
            ]
        });
        if (!updatedProduct) {
            throw new _common.NotFoundException(`Product with ID ${id} not found after update`);
        }
        // Transform file paths to full URLs if request object is provided
        if (req) {
            const [transformedProduct] = this.transformProductUrls([
                updatedProduct
            ], req);
            return transformedProduct;
        }
        return updatedProduct;
    }
    /** ----------  Helpers  ---------- */ async fetchCategory(id) {
        const cat = await this.categoryRepo.findOne({
            where: {
                id
            },
            relations: [
                'subCategories'
            ]
        });
        if (!cat) throw new _common.NotFoundException(`Category ${id} not found`);
        return {
            id: cat.id,
            name: cat.name
        };
    }
    async fetchSubCategory(idCat, idSub) {
        const sub = await this.subCategoryRepo.findOneBy({
            id: idSub,
            category: {
                id: idCat
            }
        });
        if (!sub) throw new _common.NotFoundException('SubCategory not found or not exist in this category');
        return {
            id: sub.id,
            name: sub.name
        };
    }
    async remove(id) {
        const product = await this.productRepo.findOneBy({
            id
        });
        if (!product) throw new _common.NotFoundException('Product not found');
        const productInfo = {
            id: product.id,
            name: product.name
        };
        await this.productRepo.save(product);
        // Delete the entire product directory
        const productPath = `products/${product.name.replace(/\s+/g, '_').toLowerCase()}`;
        this.fileStorageService.deleteDirectory(productPath);
        try {
            await this.productRepo.remove(product);
            return {
                success: true,
                product: productInfo,
                message: 'Product deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting product:', error);
            return {
                success: false,
                message: `Error deleting product: ${error.message}`
            };
        }
    }
    async findOne(id) {
        const product = await this.productRepo.findOne({
            where: {
                id
            },
            relations: [
                'category',
                'subCategory'
            ]
        });
        if (!product) {
            throw new _common.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async deleteAll() {
        const productPath = `products`;
        this.fileStorageService.deleteDirectory(productPath);
        await this.productRepo.createQueryBuilder().delete().from(_productentity.product).where('1 = 1').execute();
    }
    async ConnectProduct(productIds) {
        const productsIds = [];
        const products = await Promise.all(productIds.map(async (id)=>{
            const prod = await this.productRepo.findOne({
                where: {
                    id
                }
            });
            if (!prod) {
                throw new _common.NotFoundException(`Product with ID ${id} not found`);
            }
            productsIds.push(prod.id);
            return prod;
        }));
        for (const prod of products){
            prod.productIdsCollection = productsIds;
            await this.productRepo.save(prod);
        }
        return {
            data: products,
            message: 'Products connected successfully'
        };
    }
    constructor(productRepo, categoryRepo, subCategoryRepo, fileStorageService, configService){
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.subCategoryRepo = subCategoryRepo;
        this.fileStorageService = fileStorageService;
        this.configService = configService;
    }
};
ProductService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_productentity.product)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_Categoryentity.category)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_Categoryentity.subCategory)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], ProductService);

//# sourceMappingURL=product.service.js.map