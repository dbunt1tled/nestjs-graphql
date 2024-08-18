import { Filter } from 'src/core/repository/filter/filter';
import { FilterCondition } from 'src/core/repository/filter/filter.condition';
import { Pagination } from 'src/core/repository/pagination';
import { SortOrder } from 'src/core/repository/sort.order';

export class FilesFilter extends Filter {
  constructor(
    public readonly options?: {
      filter: {
        id?: string | string[];
        userId?: string | string[];
        path?: string | string[];
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
      ...this.andWhere('userId', this.options.filter.userId),
      ...this.andWhere('path', this.options.filter.path),
    });
  }
}
