"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CategoryApiFeatures", {
    enumerable: true,
    get: function() {
        return CategoryApiFeatures;
    }
});
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
let CategoryApiFeatures = class CategoryApiFeatures {
    /**
   * Returns the current pagination information
   * @returns Object containing page and limit
   */ getPaginationInfo() {
        return {
            page: this.page,
            limit: this.limit
        };
    }
    filter() {
        // Search query for category name and description
        if (this.queryString.q) {
            const q = this.queryString.q.toLowerCase();
            const words = q.split(/\s+/).filter((word)=>word.length >= 1);
            if (words.length > 0) {
                const orConditions = [];
                const params = {};
                words.forEach((word, idx)=>{
                    const param = `qword${idx}`;
                    orConditions.push(`LOWER(category.name) LIKE :${param}`);
                    orConditions.push(`LOWER(subCategory.name) LIKE :${param}`);
                    // Only add ID comparison if the word is a valid number
                    const numericValue = Number(word);
                    if (!isNaN(numericValue) && Number.isInteger(numericValue)) {
                        const idParam = `id${idx}`;
                        orConditions.push(`category.id = :${idParam}`);
                        params[idParam] = numericValue.toString();
                    }
                    params[param] = `%${word}%`;
                });
                if (orConditions.length > 0) {
                    this.queryBuilder.andWhere(`(${orConditions.join(' OR ')})`, params);
                }
            }
        }
        // Filter by category name
        if (this.queryString.name) {
            const categoryName = this.queryString.name.toLowerCase();
            this.queryBuilder.andWhere('LOWER(category.name) LIKE :categoryName', {
                categoryName: `%${categoryName}%`
            });
        }
        // Filter by category ID
        if (this.queryString.id) {
            const categoryId = Number(this.queryString.id);
            if (!isNaN(categoryId)) {
                this.queryBuilder.andWhere('category.id = :categoryId', {
                    categoryId
                });
            }
        }
        // Filter by active status
        if (this.queryString.isActive !== undefined) {
            const isActive = this.queryString.isActive === 'true';
            this.queryBuilder.andWhere('category.isActive = :isActive', {
                isActive
            });
        }
        // Filter by having subcategories
        if (this.queryString.hasSubCategories !== undefined) {
            const hasSubCategories = this.queryString.hasSubCategories === 'true';
            if (hasSubCategories) {
                this.queryBuilder.andWhere('subCategory.id IS NOT NULL');
            } else {
                this.queryBuilder.andWhere('subCategory.id IS NULL');
            }
        }
        // Handle other filters
        const queryObj = _object_spread({}, this.queryString);
        const excludedFields = [
            'page',
            'sort',
            'limit',
            'fields',
            'q',
            'name',
            'id',
            'isActive',
            'hasSubCategories'
        ];
        excludedFields.forEach((el)=>delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne)\b/g, (match)=>`$${match}`);
        const parsedQuery = JSON.parse(queryStr);
        Object.keys(parsedQuery).forEach((key)=>{
            const column = this.entityMetadata.columns.find((col)=>col.propertyName === key);
            if (!column) return;
            const value = parsedQuery[key];
            if (typeof value === 'object' && value !== null) {
                Object.keys(value).forEach((operator)=>{
                    const operatorValue = value[operator];
                    switch(operator){
                        case '$gte':
                            this.queryBuilder.andWhere(`category.${column.propertyName} >= :${key}Gte`, {
                                [`${key}Gte`]: operatorValue
                            });
                            break;
                        case '$gt':
                            this.queryBuilder.andWhere(`category.${column.propertyName} > :${key}Gt`, {
                                [`${key}Gt`]: operatorValue
                            });
                            break;
                        case '$lte':
                            this.queryBuilder.andWhere(`category.${column.propertyName} <= :${key}Lte`, {
                                [`${key}Lte`]: operatorValue
                            });
                            break;
                        case '$lt':
                            this.queryBuilder.andWhere(`category.${column.propertyName} < :${key}Lt`, {
                                [`${key}Lt`]: operatorValue
                            });
                            break;
                        case '$ne':
                            this.queryBuilder.andWhere(`category.${column.propertyName} != :${key}Ne`, {
                                [`${key}Ne`]: operatorValue
                            });
                            break;
                    }
                });
            } else {
                this.queryBuilder.andWhere(`category.${column.propertyName} = :${key}`, {
                    [key]: value
                });
            }
        });
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').map((field)=>{
                const direction = field.startsWith('-') ? 'DESC' : 'ASC';
                const actualField = field.startsWith('-') ? field.substring(1) : field;
                const column = this.entityMetadata.columns.find((col)=>col.propertyName === actualField);
                if (column) {
                    return `category.${column.propertyName} ${direction}`;
                }
                return null;
            }).filter(Boolean).join(', ');
            if (sortBy) {
                this.queryBuilder.orderBy(sortBy);
            }
        } else {
            // Default sort by createdAt
            const createdAtCol = this.entityMetadata.columns.find((col)=>col.propertyName === 'createdAt');
            if (createdAtCol) {
                this.queryBuilder.orderBy('category.createdAt', 'DESC');
            }
        }
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').map((field)=>{
                const column = this.entityMetadata.columns.find((col)=>col.propertyName === field);
                return column ? `category.${column.propertyName}` : null;
            }).filter(Boolean);
            // Always include id and basic relations
            if (!fields.includes('category.id')) {
                fields.unshift('category.id');
            }
            // Add subcategory fields if we have them
            fields.push('subCategory.id', 'subCategory.name', 'subCategory.icon', 'subCategory.isActive');
            this.queryBuilder.select(fields);
        }
        return this;
    }
    paginate() {
        this.page = Number(this.queryString.page) || 1;
        this.limit = Number(this.queryString.limit) || 10;
        this.skip = (this.page - 1) * this.limit;
        this.queryBuilder.skip(this.skip).take(this.limit);
        return this;
    }
    async getManyAndCount() {
        return await this.queryBuilder.getManyAndCount();
    }
    async getMany() {
        return await this.queryBuilder.getMany();
    }
    constructor(queryBuilder, queryString, entityMetadata){
        this.queryBuilder = queryBuilder;
        this.queryString = queryString;
        this.page = 1;
        this.limit = 10;
        this.skip = 0;
        this.entityMetadata = entityMetadata;
    }
};

//# sourceMappingURL=category-api-features.js.map