import { SortOrder } from 'src/core/repository/sort.order';
import { Pagination } from 'src/core/repository/pagination';

export interface FilterOptions {
  filter?: object;
  sort?: SortOrder;
  pagination?: Pagination;
}
