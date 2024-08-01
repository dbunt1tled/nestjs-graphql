import { Filter } from 'src/core/repository/filter/filter';
import { FilterCondition } from 'src/core/repository/filter/filter.condition';
import { Pagination } from 'src/core/repository/pagination';
import { SortOrder } from 'src/core/repository/sort.order';

export class RolesFilter extends Filter {
  constructor(
    public readonly options?: {
      filter: {
        userId?: string | string[];
        role?: string | string[];
      };
      sort?: SortOrder;
      pagination?: Pagination;
    },
  ) {
    super(options);
  }
  build(limit?: number): FilterCondition {
    return super.build(limit, {
      ...this.andWhere('userId', this.options.filter.userId),
      ...this.andWhere('role', this.options.filter.role),
    });
  }
}
