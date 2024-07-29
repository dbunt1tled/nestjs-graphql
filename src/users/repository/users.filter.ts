import { Filter } from 'src/core/repository/filter/filter';
import { FilterCondition } from 'src/core/repository/filter/filter.condition';
import { Pagination } from 'src/core/repository/pagination';
import { SortOrder } from 'src/core/repository/sort.order';

export class UsersFilter extends Filter {
  constructor(
    public readonly options?: {
      filter: {
        id?: number | number[];
        email?: string | string[];
        name?: string;
        nameFilter?: string;
        emailFilter?: string | string[];
        userIdExclude?: number | number[];
      };
      sort?: SortOrder;
      pagination?: Pagination;
    },
  ) {
    super(options);
  }
  build(limit?: number): FilterCondition {
    return super.build(limit, {
      ...this.andWhere('id', this.options.filter.id),
      ...this.andWhere('email', this.options.filter.email),
      ...this.andWhere('email', this.options.filter.email),
      ...this.andWhere('name', this.options.filter.name),
      ...this.andWhereLike('name', this.options.filter.nameFilter),
      ...this.andWhereNot('id', this.options.filter.userIdExclude),
    });
  }
}
