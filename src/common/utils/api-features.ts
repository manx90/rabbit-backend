import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { ParsedQs } from 'qs';

export class ApiFeatures<T extends ObjectLiteral> {
  private page: number;
  private limit: number;
  private skip: number;

  constructor(
    private queryBuilder: SelectQueryBuilder<T>,
    private queryString: ParsedQs,
  ) {
    this.page = 1;
    this.limit = 10;
    this.skip = 0;
  }

  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne)\b/g,
      (match) => `$${match}`,
    );
    const parsedQuery = JSON.parse(queryStr) as Record<string, any>;

    Object.keys(parsedQuery).forEach((key) => {
      const value = parsedQuery[key] as Record<string, any>;
      if (typeof value === 'object' && value !== null) {
        Object.keys(value).forEach((operator) => {
          const operatorValue = value[operator] as Record<string, any>;
          switch (operator) {
            case '$gte':
              this.queryBuilder.andWhere(`${key} >= :${key}Gte`, {
                [`${key}Gte`]: operatorValue,
              });
              break;
            case '$gt':
              this.queryBuilder.andWhere(`${key} > :${key}Gt`, {
                [`${key}Gt`]: operatorValue,
              });
              break;
            case '$lte':
              this.queryBuilder.andWhere(`${key} <= :${key}Lte`, {
                [`${key}Lte`]: operatorValue,
              });
              break;
            case '$lt':
              this.queryBuilder.andWhere(`${key} < :${key}Lt`, {
                [`${key}Lt`]: operatorValue,
              });
              break;
            case '$ne':
              this.queryBuilder.andWhere(`${key} != :${key}Ne`, {
                [`${key}Ne`]: operatorValue,
              });
              break;
          }
        });
      } else {
        this.queryBuilder.andWhere(`${key} = :${key}`, { [key]: value });
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
          return `product.${actualField} ${direction}`;
        })
        .join(', ');

      this.queryBuilder.orderBy(sortBy);
    } else {
      // Default sort by creation date
      this.queryBuilder.orderBy('product.createdAt', 'DESC');
    }

    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = (this.queryString.fields as string)
        .split(',')
        .map((field) => `product.${field}`);

      // Always include id
      if (!fields.includes('product.id')) {
        fields.unshift('product.id');
      }

      this.queryBuilder.select(fields);
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
