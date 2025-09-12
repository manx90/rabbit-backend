/* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable prettier/prettier */ /* eslint-disable @typescript-eslint/no-unsafe-assignment */ "use strict";
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
const _entityinterface = require("../common/interfaces/entity.interface");
const _typeorm1 = require("typeorm");
const _productentity = require("./entities/product.entity");
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
    async UpdateStatus(id) {
        const prod = await this.productRepo.findOne({
            where: {
                id
            }
        });
        if (!prod) {
            throw new Error('Product not found');
        }
        console.log('Current publishState:', prod.publishState);
        if (prod.publishState === _entityinterface.PublishState.PUBLISHED) {
            prod.publishState = _entityinterface.PublishState.DRAFT;
        } else {
            prod.publishState = _entityinterface.PublishState.PUBLISHED;
        }
        // Set flag to indicate this is a manual state change (only if column exists)
        if (prod.hasOwnProperty('isManualPublishState')) {
            prod.isManualPublishState = true;
        }
        console.log('New publishState:', prod.publishState);
        await this.productRepo.save(prod);
        return prod;
    }
    async ShowSeason(season) {
        // Find all products with the given season
        const products = await this.productRepo.find({
            where: {
                season: season
            }
        });
        if (!products || products.length === 0) {
            return 0;
        }
        for (const prod of products){
            prod.publishState = _entityinterface.PublishState.PUBLISHED;
            if (prod.hasOwnProperty('isManualPublishState')) {
                prod.isManualPublishState = true;
            }
            const newProd = await this.productRepo.save(prod);
            console.log(newProd);
        }
        return products.length;
    }
    async HiddenSeason(season) {
        // Find all products with the given season
        const products = await this.productRepo.find({
            where: {
                season: season
            }
        });
        if (!products || products.length === 0) {
            return 0;
        }
        for (const prod of products){
            prod.publishState = _entityinterface.PublishState.DRAFT;
            if (prod.hasOwnProperty('isManualPublishState')) {
                prod.isManualPublishState = true;
            }
            await this.productRepo.save(prod);
        }
        return products.length;
    }
    // ========== STATISTICS FUNCTIONS ==========
    /**
   * Get total count of all products
   */ async getTotalProductsCount() {
        return await this.productRepo.count();
    }
    /**
   * Get count of products by publish state
   */ async getProductsCountByPublishState() {
        const [published, draft, total] = await Promise.all([
            this.productRepo.count({
                where: {
                    publishState: _entityinterface.PublishState.PUBLISHED
                }
            }),
            this.productRepo.count({
                where: {
                    publishState: _entityinterface.PublishState.DRAFT
                }
            }),
            this.productRepo.count()
        ]);
        return {
            published,
            draft,
            total
        };
    }
    /**
   * Get count of products by season
   */ async getProductsCountBySeason() {
        const [winter, summer, spring_autumn, all, total] = await Promise.all([
            this.productRepo.count({
                where: {
                    season: _productentity.Season.winter
                }
            }),
            this.productRepo.count({
                where: {
                    season: _productentity.Season.summer
                }
            }),
            this.productRepo.count({
                where: {
                    season: _productentity.Season.spring_autumn
                }
            }),
            this.productRepo.count({
                where: {
                    season: _productentity.Season.all
                }
            }),
            this.productRepo.count()
        ]);
        return {
            winter,
            summer,
            spring_autumn,
            all,
            total
        };
    }
    /**
   * Get count of products by special flags
   */ async getProductsCountByFlags() {
        const [featured, trending, newProducts, bestSeller, deleted] = await Promise.all([
            this.productRepo.count({
                where: {
                    isFeatured: true
                }
            }),
            this.productRepo.count({
                where: {
                    isTrending: true
                }
            }),
            this.productRepo.count({
                where: {
                    isNew: true
                }
            }),
            this.productRepo.count({
                where: {
                    isBestSeller: true
                }
            }),
            this.productRepo.count({
                where: {
                    isDeleted: true
                }
            })
        ]);
        return {
            featured,
            trending,
            new: newProducts,
            bestSeller,
            deleted
        };
    }
    /**
   * Get products created in the last N days
   */ async getProductsCreatedInLastDays(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return await this.productRepo.count({
            where: {
                createdAt: (0, _typeorm1.Between)(startDate, new Date())
            }
        });
    }
    /**
   * Get products created by date range
   */ async getProductsCreatedInDateRange(startDate, endDate) {
        return await this.productRepo.count({
            where: {
                createdAt: (0, _typeorm1.Between)(startDate, endDate)
            }
        });
    }
    /**
   * Get products count by category
   */ async getProductsCountByCategory() {
        const result = await this.productRepo.createQueryBuilder('product').leftJoin('product.category', 'category').select('category.id', 'categoryId').addSelect('category.name', 'categoryName').addSelect('COUNT(product.id)', 'count').groupBy('category.id, category.name').getRawMany();
        return result.map((row)=>({
                categoryId: parseInt(row.categoryId),
                categoryName: row.categoryName || 'No Category',
                count: parseInt(row.count)
            }));
    }
    /**
   * Get products count by subcategory
   */ async getProductsCountBySubCategory() {
        const result = await this.productRepo.createQueryBuilder('product').leftJoin('product.subCategory', 'subCategory').leftJoin('product.category', 'category').select('subCategory.id', 'subCategoryId').addSelect('subCategory.name', 'subCategoryName').addSelect('category.name', 'categoryName').addSelect('COUNT(product.id)', 'count').groupBy('subCategory.id, subCategory.name, category.name').getRawMany();
        return result.map((row)=>({
                subCategoryId: parseInt(row.subCategoryId),
                subCategoryName: row.subCategoryName || 'No SubCategory',
                categoryName: row.categoryName || 'No Category',
                count: parseInt(row.count)
            }));
    }
    /**
   * Get top selling products (by sales count)
   */ async getTopSellingProducts(limit = 10) {
        const products = await this.productRepo.find({
            select: [
                'id',
                'name',
                'sales',
                'quantity'
            ],
            order: {
                sales: 'DESC'
            },
            take: limit
        });
        return products.map((product)=>({
                id: product.id,
                name: product.name,
                sales: product.sales,
                totalQuantity: product.quantity
            }));
    }
    /**
   * Get products with low stock (quantity < threshold)
   */ async getLowStockProducts(threshold = 10) {
        const products = await this.productRepo.find({
            select: [
                'id',
                'name',
                'quantity',
                'season'
            ],
            where: {
                quantity: (0, _typeorm1.Between)(0, threshold),
                isDeleted: false
            },
            order: {
                quantity: 'ASC'
            }
        });
        return products.map((product)=>({
                id: product.id,
                name: product.name,
                quantity: product.quantity,
                season: product.season
            }));
    }
    /**
   * Get products without images
   */ async getProductsWithoutImages() {
        const products = await this.productRepo.find({
            select: [
                'id',
                'name',
                'imgCover',
                'images',
                'imgSizeChart',
                'imgMeasure'
            ]
        });
        return products.filter((product)=>!product.imgCover || !product.images || product.images.length === 0 || !product.imgSizeChart || !product.imgMeasure).map((product)=>({
                id: product.id,
                name: product.name,
                hasCover: !!product.imgCover,
                hasImages: !!(product.images && product.images.length > 0),
                hasSizeChart: !!product.imgSizeChart,
                hasMeasure: !!product.imgMeasure
            }));
    }
    /**
   * Get average sales per product
   */ async getAverageSalesPerProduct() {
        const [totalProducts, totalSalesRaw] = await Promise.all([
            this.getTotalProductsCount(),
            this.productRepo.createQueryBuilder('product').select('SUM(product.sales)', 'totalSales').getRawOne()
        ]);
        const totalSales = parseInt((totalSalesRaw === null || totalSalesRaw === void 0 ? void 0 : totalSalesRaw.totalSales) || '0');
        const average = totalProducts > 0 ? totalSales / totalProducts : 0;
        return {
            averageSalesPerProduct: Math.round(average * 100) / 100,
            totalProducts,
            totalSales
        };
    }
    /**
   * Get comprehensive product statistics
   */ async getComprehensiveStats() {
        const [totalProducts, publishStateStats, seasonStats, flagStats, last7Days, last30Days, last90Days, categoryStats, topSelling, lowStock, productsWithoutImages, salesStats] = await Promise.all([
            this.getTotalProductsCount(),
            this.getProductsCountByPublishState(),
            this.getProductsCountBySeason(),
            this.getProductsCountByFlags(),
            this.getProductsCreatedInLastDays(7),
            this.getProductsCreatedInLastDays(30),
            this.getProductsCreatedInLastDays(90),
            this.getProductsCountByCategory(),
            this.getTopSellingProducts(5),
            this.getLowStockProducts(10),
            this.getProductsWithoutImages(),
            this.getSalesStatistics()
        ]);
        return {
            totalProducts,
            publishStateStats,
            seasonStats,
            flagStats,
            recentStats: {
                last7Days,
                last30Days,
                last90Days
            },
            categoryStats,
            topSelling,
            lowStock,
            missingImages: productsWithoutImages.length,
            salesStats,
            recentChange: {
                last7Days: await this.getPeriodChange(7),
                last30Days: await this.getPeriodChange(30),
                last90Days: await this.getPeriodChange(90)
            }
        };
    }
    async getPeriodChange(days) {
        const now = new Date();
        const startCurrent = new Date();
        startCurrent.setDate(now.getDate() - days);
        const startPrevious = new Date();
        startPrevious.setDate(startCurrent.getDate() - days);
        const [current, previous] = await Promise.all([
            this.productRepo.count({
                where: {
                    createdAt: (0, _typeorm1.Between)(startCurrent, now)
                }
            }),
            this.productRepo.count({
                where: {
                    createdAt: (0, _typeorm1.Between)(startPrevious, startCurrent)
                }
            })
        ]);
        const percentChange = previous === 0 ? current > 0 ? 100 : 0 : (current - previous) / previous * 100;
        return {
            current,
            previous,
            percentChange: Math.round(percentChange * 100) / 100
        };
    }
    /**
   * Get products count by creator (poster)
   */ async getProductsCountByCreator() {
        const result = await this.productRepo.createQueryBuilder('product').leftJoin('product.poster', 'auth').select('auth.id', 'posterId').addSelect('auth.username', 'username').addSelect('COUNT(product.id)', 'count').groupBy('auth.id, auth.username').getRawMany();
        return result.map((row)=>({
                posterId: row.posterId || 'Unknown',
                username: row.username || 'Unknown User',
                count: parseInt(row.count)
            }));
    }
    /**
   * Get products with scheduled publishing
   */ async getScheduledProducts() {
        const products = await this.productRepo.find({
            select: [
                'id',
                'name',
                'datePublished',
                'publishState'
            ],
            where: {
                datePublished: (0, _typeorm1.Between)(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000))
            },
            order: {
                datePublished: 'ASC'
            }
        });
        return products.map((product)=>({
                id: product.id,
                name: product.name,
                datePublished: product.datePublished,
                publishState: product.publishState
            }));
    }
    /**
   * Get comprehensive sales statistics
   */ async getSalesStatistics() {
        // Get total sales across all products
        const totalSalesResult = await this.productRepo.createQueryBuilder('product').select('SUM(product.sales)', 'totalSales').getRawOne();
        const totalSales = parseInt((totalSalesResult === null || totalSalesResult === void 0 ? void 0 : totalSalesResult.totalSales) || '0');
        // Get total revenue by estimating unit price from sizeDetails (no product.price column)
        // Strategy: for each product, compute the average price across its sizes, then multiply by sales
        const productsForRevenue = await this.productRepo.find({
            select: [
                'id',
                'sales',
                'sizeDetails'
            ]
        });
        const totalRevenue = productsForRevenue.reduce((sum, p)=>{
            const sizes = Array.isArray(p.sizeDetails) ? p.sizeDetails : [];
            if (sizes.length === 0 || typeof p.sales !== 'number' || p.sales <= 0) return sum;
            const priceValues = sizes.map((s)=>typeof (s === null || s === void 0 ? void 0 : s.price) === 'number' ? s.price : Number(s === null || s === void 0 ? void 0 : s.price)).filter((v)=>Number.isFinite(v));
            if (priceValues.length === 0) return sum;
            const avgPrice = priceValues.reduce((a, b)=>a + b, 0) / priceValues.length;
            return sum + avgPrice * p.sales;
        }, 0);
        // Get total products count for average calculation
        const totalProducts = await this.getTotalProductsCount();
        const averageSalesPerProduct = totalProducts > 0 ? totalSales / totalProducts : 0;
        // Get best selling product
        const bestSellingProduct = await this.productRepo.findOne({
            select: [
                'id',
                'name',
                'sales'
            ],
            where: {
                sales: (0, _typeorm1.Between)(1, 999999)
            },
            order: {
                sales: 'DESC'
            }
        });
        // Get sales by category
        const salesByCategoryResult = await this.productRepo.createQueryBuilder('product').leftJoin('product.category', 'category').select('category.id', 'categoryId').addSelect('category.name', 'categoryName').addSelect('SUM(product.sales)', 'totalSales').addSelect('COUNT(product.id)', 'productCount').where('product.sales > 0').groupBy('category.id, category.name').orderBy('totalSales', 'DESC').getRawMany();
        const salesByCategory = salesByCategoryResult.map((row)=>({
                categoryId: parseInt(row.categoryId || '0'),
                categoryName: row.categoryName || 'Uncategorized',
                totalSales: parseInt(row.totalSales || '0'),
                productCount: parseInt(row.productCount || '0')
            }));
        return {
            totalSales,
            totalRevenue,
            averageSalesPerProduct: Math.round(averageSalesPerProduct * 100) / 100,
            bestSellingProduct: bestSellingProduct ? {
                id: bestSellingProduct.id,
                name: bestSellingProduct.name,
                sales: bestSellingProduct.sales
            } : null,
            salesByCategory
        };
    }
    constructor(productRepo){
        this.productRepo = productRepo;
    }
};
ProductService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_productentity.product)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ProductService);

//# sourceMappingURL=product.service.js.map