import { FilterCondition } from './filter.condition';
import { FilterOptions } from 'src/core/repository/filter/filter.options';
import { ILike, In, IsNull, Not } from 'typeorm';

export class Filter {
  constructor(public readonly options?: FilterOptions) {}

  build(limit?: number, where?: object): FilterCondition {
    let take = limit;
    let skip = undefined;
    if (this.options.pagination?.page) {
      take = this.options.pagination.limit;
      skip = (this.options.pagination.page - 1) * this.options.pagination.limit;
    }
    return {
      where: where,
      order: this.options.sort,
      skip: skip,
      take: take,
    };
  }

  andWhere(field: string, value: any): object {
    if (value === undefined) {
      return {};
    }
    if (Array.isArray(value)) {
      return { [field]: In([...value]) };
    }
    return { [field]: value };
  }

  andWhereNot(field: string, value: any): object {
    if (value === undefined) {
      return {};
    }
    if (Array.isArray(value)) {
      return { [field]: Not(value) };
    }
    return { [field]: Not(In([...value])) };
  }

  andWhereLike(field: string, value: any): object {
    if (value === undefined) {
      return {};
    }
    if (Array.isArray(value)) {
      return value.map((v) => ({ [field]: ILike(`%${v}%`) }));
    }
    return { [field]: ILike(`%${value}%`) };
  }

  andWhereNull(field: string, value: any): object {
    if (value === undefined) {
      return {};
    }
    return { [field]: IsNull() };
  }

  andWhereNotNull(field: string, value: any): object {
    if (value === undefined) {
      return {};
    }
    return { [field]: Not(IsNull()) };
  }
}
