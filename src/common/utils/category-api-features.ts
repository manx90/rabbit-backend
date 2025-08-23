import { ObjectLiteral, SelectQueryBuilder, EntityMetadata } from 'typeorm';
import { ParsedQs } from 'qs';

export class CategoryApiFeatures<T extends ObjectLiteral> {
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
    // Search query for category name and description
    if (this.queryString.q) {
      const q = (this.queryString.q as string).toLowerCase();
      const words = q.split(/\s+/).filter((word) => word.length >= 1);
      if (words.length > 0) {
        const orConditions: string[] = [];
        const params: Record<string, string | number> = {};
        words.forEach((word, idx) => {
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
      const categoryName = (this.queryString.name as string).toLowerCase();
      this.queryBuilder.andWhere('LOWER(category.name) LIKE :categoryName', {
        categoryName: `%${categoryName}%`,
      });
    }

    // Filter by category ID
    if (this.queryString.id) {
      const categoryId = Number(this.queryString.id);
      if (!isNaN(categoryId)) {
        this.queryBuilder.andWhere('category.id = :categoryId', { categoryId });
      }
    }

    // Filter by active status
    if (this.queryString.isActive !== undefined) {
      const isActive = this.queryString.isActive === 'true';
      this.queryBuilder.andWhere('category.isActive = :isActive', { isActive });
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
    const queryObj = { ...this.queryString };
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
      'q',
      'name',
      'id',
      'isActive',
      'hasSubCategories',
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne)\b/g,
      (match) => `$${match}`,
    );
    const parsedQuery = JSON.parse(queryStr) as Record<string, any>;

    Object.keys(parsedQuery).forEach((key) => {
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
                `category.${column.propertyName} >= :${key}Gte`,
                {
                  [`${key}Gte`]: operatorValue,
                },
              );
              break;
            case '$gt':
              this.queryBuilder.andWhere(
                `category.${column.propertyName} > :${key}Gt`,
                {
                  [`${key}Gt`]: operatorValue,
                },
              );
              break;
            case '$lte':
              this.queryBuilder.andWhere(
                `category.${column.propertyName} <= :${key}Lte`,
                {
                  [`${key}Lte`]: operatorValue,
                },
              );
              break;
            case '$lt':
              this.queryBuilder.andWhere(
                `category.${column.propertyName} < :${key}Lt`,
                {
                  [`${key}Lt`]: operatorValue,
                },
              );
              break;
            case '$ne':
              this.queryBuilder.andWhere(
                `category.${column.propertyName} != :${key}Ne`,
                {
                  [`${key}Ne`]: operatorValue,
                },
              );
              break;
          }
        });
      } else {
        this.queryBuilder.andWhere(
          `category.${column.propertyName} = :${key}`,
          {
            [key]: value,
          },
        );
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
          const column = this.entityMetadata.columns.find(
            (col) => col.propertyName === actualField,
          );
          if (column) {
            return `category.${column.propertyName} ${direction}`;
          }
          return null;
        })
        .filter(Boolean)
        .join(', ');

      if (sortBy) {
        this.queryBuilder.orderBy(sortBy);
      }
    } else {
      // Default sort by createdAt
      const createdAtCol = this.entityMetadata.columns.find(
        (col) => col.propertyName === 'createdAt',
      );
      if (createdAtCol) {
        this.queryBuilder.orderBy('category.createdAt', 'DESC');
      }
    }

    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = (this.queryString.fields as string)
        .split(',')
        .map((field) => {
          const column = this.entityMetadata.columns.find(
            (col) => col.propertyName === field,
          );
          return column ? `category.${column.propertyName}` : null;
        })
        .filter(Boolean);

      // Always include id and basic relations
      if (!fields.includes('category.id')) {
        fields.unshift('category.id');
      }

      // Add subcategory fields if we have them
      fields.push(
        'subCategory.id',
        'subCategory.name',
        'subCategory.icon',
        'subCategory.isActive',
      );

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
