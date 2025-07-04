import { ObjectLiteral, SelectQueryBuilder, EntityMetadata } from 'typeorm';
import { ParsedQs } from 'qs';

export class ApiFeatures<T extends ObjectLiteral> {
  /**
   * Returns the current pagination information
   * @returns Object containing page and limit
   */
  getPaginationInfo(): { page: number; limit: number } {
    return {
      page: this.page,
      limit: this.limit,
    };
  }
  private page: number;
  private limit: number;
  private skip: number;
  private entityMetadata: EntityMetadata;

  constructor(
    private queryBuilder: SelectQueryBuilder<T>,
    private queryString: ParsedQs,
    entityMetadata: EntityMetadata,
  ) {
    this.page = 1;
    this.limit = 10;
    this.skip = 0;
    this.entityMetadata = entityMetadata;
  }

  filter(): this {
    // Dynamic search across all string fields
    if (this.queryString.q) {
      const q = (this.queryString.q as string).toLowerCase();
      const words = q.split(/\s+/).filter((word) => word.length >= 3);
      if (words.length > 0) {
        const orConditions: string[] = [];
        const params: Record<string, string> = {};
        // Search 'name' in product, category, and subCategory tables
        words.forEach((word, idx) => {
          const param = `qword${idx}`;
          orConditions.push(`LOWER(product.name) LIKE :${param}`);
          orConditions.push(`LOWER(category.name) LIKE :${param}`);
          orConditions.push(`LOWER(subCategory.name) LIKE :${param}`);
          // Also search other string columns in product
          orConditions.push(`LOWER(product.description) LIKE :${param}`);
          orConditions.push(`LOWER(product.imgCover) LIKE :${param}`);
          orConditions.push(`LOWER(product.imgSizeChart) LIKE :${param}`);
          orConditions.push(`LOWER(product.imgMeasure) LIKE :${param}`);
          orConditions.push(`LOWER(auth.id) LIKE :${param}`);
          params[param] = `%${word}%`;
        });
        if (orConditions.length > 0) {
          this.queryBuilder.andWhere(`(${orConditions.join(' OR ')})`, params);
        }
      }
    }

    // Special query for category name or id
    if (this.queryString.category) {
      const categoryValue = this.queryString.category as string;
      if (!isNaN(Number(categoryValue))) {
        // If category is a number, filter by categoryId
        this.queryBuilder.andWhere('product.categoryId = :categoryId', {
          categoryId: Number(categoryValue),
        });
      } else {
        // Otherwise, filter by name
        const category = categoryValue.toLowerCase();
        this.queryBuilder.andWhere('LOWER(category.name) = :category', {
          category,
        });
      }
    }
    // Special query for subCategory name or id
    if (this.queryString.subCategory) {
      const subCategoryValue = this.queryString.subCategory as string;
      if (!isNaN(Number(subCategoryValue))) {
        // If subCategory is a number, filter by subCategoryId
        this.queryBuilder.andWhere('product.subCategoryId = :subCategoryId', {
          subCategoryId: Number(subCategoryValue),
        });
      } else {
        // Otherwise, filter by name
        const subCategory = subCategoryValue.toLowerCase();
        this.queryBuilder.andWhere('LOWER(subCategory.name) = :subCategory', {
          subCategory,
        });
      }
    }
    // Special query for category id
    if (this.queryString.categoryId) {
      const categoryId = Number(this.queryString.categoryId);
      if (!isNaN(categoryId)) {
        this.queryBuilder.andWhere('product.categoryId = :categoryId', {
          categoryId,
        });
      }
    }
    // Special query for subCategory id
    if (this.queryString.subCategoryId) {
      const subCategoryId = Number(this.queryString.subCategoryId);
      if (!isNaN(subCategoryId)) {
        this.queryBuilder.andWhere('product.subCategoryId = :subCategoryId', {
          subCategoryId,
        });
      }
    }

    // Special query for product id
    if (this.queryString.id) {
      const productId = Number(this.queryString.id);
      if (!isNaN(productId)) {
        this.queryBuilder.andWhere('product.id = :productId', { productId });
      }
    }

    // Add this for productName search
    if (this.queryString.productName) {
      const productName = (
        this.queryString.productName as string
      ).toLowerCase();
      this.queryBuilder.andWhere('LOWER(product.name) LIKE :productName', {
        productName: `%${productName}%`,
      });
    }

    const queryObj = { ...this.queryString };
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
      'q',
      'category',
      'subCategory',
      'categoryId',
      'subCategoryId',
      'id',
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne)\b/g,
      (match) => `$${match}`,
    );
    const parsedQuery = JSON.parse(queryStr) as Record<string, any>;

    Object.keys(parsedQuery).forEach((key) => {
      // Only allow filtering on valid entity columns
      const column = this.entityMetadata.columns.find(
        (col) => col.propertyName === key,
      );
      if (!column) return;
      const value = parsedQuery[key] as Record<string, any>;
      if (typeof value === 'object' && value !== null) {
        Object.keys(value).forEach((operator) => {
          const operatorValue = value[operator] as Record<string, any>;
          switch (operator) {
            case '$gte':
              this.queryBuilder.andWhere(
                `product.${column.propertyName} >= :${key}Gte`,
                {
                  [`${key}Gte`]: operatorValue,
                },
              );
              break;
            case '$gt':
              this.queryBuilder.andWhere(
                `product.${column.propertyName} > :${key}Gt`,
                {
                  [`${key}Gt`]: operatorValue,
                },
              );
              break;
            case '$lte':
              this.queryBuilder.andWhere(
                `product.${column.propertyName} <= :${key}Lte`,
                {
                  [`${key}Lte`]: operatorValue,
                },
              );
              break;
            case '$lt':
              this.queryBuilder.andWhere(
                `product.${column.propertyName} < :${key}Lt`,
                {
                  [`${key}Lt`]: operatorValue,
                },
              );
              break;
            case '$ne':
              this.queryBuilder.andWhere(
                `product.${column.propertyName} != :${key}Ne`,
                {
                  [`${key}Ne`]: operatorValue,
                },
              );
              break;
          }
        });
      } else {
        this.queryBuilder.andWhere(`product.${column.propertyName} = :${key}`, {
          [key]: value,
        });
      }
    });

    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = (this.queryString.sort as string)
        .split(',')
        .map((field) => {
          const direction = field.startsWith('-') ? 'DESC' : 'ASC';
          const actualField = field.startsWith('-')
            ? field.substring(1)
            : field;
          // Only allow sorting by valid entity columns
          const column = this.entityMetadata.columns.find(
            (col) => col.propertyName === actualField,
          );
          if (column) {
            return `${column.propertyPath} ${direction}`;
          }
          return null;
        })
        .filter(Boolean)
        .join(', ');

      if (sortBy) {
        this.queryBuilder.orderBy(sortBy);
      }
    } else {
      // Default sort by creation date if exists
      const createdAtCol = this.entityMetadata.columns.find(
        (col) => col.propertyName === 'createdAt',
      );
      if (createdAtCol) {
        this.queryBuilder.orderBy('product.createdAt', 'DESC');
      }
    }

    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = (this.queryString.fields as string)
        .split(',')
        .map((field) => {
          // Only allow selecting valid entity columns
          const column = this.entityMetadata.columns.find(
            (col) => col.propertyName === field,
          );
          return column ? column.propertyPath : null;
        })
        .filter(Boolean);

      // Always include id
      if (!fields.includes(`${this.entityMetadata.name}.id`)) {
        fields.unshift(`${this.entityMetadata.name}.id`);
      }

      this.queryBuilder.select(fields as string[]);
    }

    return this;
  }

  paginate(): this {
    this.page = Number(this.queryString.page) || 1;
    this.limit = Number(this.queryString.limit) || 10;
    this.skip = (this.page - 1) * this.limit;

    this.queryBuilder.skip(this.skip).take(this.limit);

    return this;
  }

  async getManyAndCount(): Promise<[T[], number]> {
    return await this.queryBuilder.getManyAndCount();
  }

  async getMany(): Promise<T[]> {
    return await this.queryBuilder.getMany();
  }
}
