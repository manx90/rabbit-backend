"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApiFeatures", {
    enumerable: true,
    get: function() {
        return ApiFeatures;
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
let ApiFeatures = class ApiFeatures {
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
        const queryObj = _object_spread({}, this.queryString);
        const excludedFields = [
            'page',
            'sort',
            'limit',
            'fields'
        ];
        excludedFields.forEach((el)=>delete queryObj[el]);
        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne)\b/g, (match)=>`$${match}`);
        const parsedQuery = JSON.parse(queryStr);
        Object.keys(parsedQuery).forEach((key)=>{
            const value = parsedQuery[key];
            if (typeof value === 'object' && value !== null) {
                Object.keys(value).forEach((operator)=>{
                    const operatorValue = value[operator];
                    switch(operator){
                        case '$gte':
                            this.queryBuilder.andWhere(`${key} >= :${key}Gte`, {
                                [`${key}Gte`]: operatorValue
                            });
                            break;
                        case '$gt':
                            this.queryBuilder.andWhere(`${key} > :${key}Gt`, {
                                [`${key}Gt`]: operatorValue
                            });
                            break;
                        case '$lte':
                            this.queryBuilder.andWhere(`${key} <= :${key}Lte`, {
                                [`${key}Lte`]: operatorValue
                            });
                            break;
                        case '$lt':
                            this.queryBuilder.andWhere(`${key} < :${key}Lt`, {
                                [`${key}Lt`]: operatorValue
                            });
                            break;
                        case '$ne':
                            this.queryBuilder.andWhere(`${key} != :${key}Ne`, {
                                [`${key}Ne`]: operatorValue
                            });
                            break;
                    }
                });
            } else {
                this.queryBuilder.andWhere(`${key} = :${key}`, {
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
                return `product.${actualField} ${direction}`;
            }).join(', ');
            this.queryBuilder.orderBy(sortBy);
        } else {
            // Default sort by creation date
            this.queryBuilder.orderBy('product.createdAt', 'DESC');
        }
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').map((field)=>`product.${field}`);
            // Always include id
            if (!fields.includes('product.id')) {
                fields.unshift('product.id');
            }
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
    constructor(queryBuilder, queryString){
        this.queryBuilder = queryBuilder;
        this.queryString = queryString;
        this.page = 1;
        this.limit = 10;
        this.skip = 0;
    }
};

//# sourceMappingURL=api-features.js.map