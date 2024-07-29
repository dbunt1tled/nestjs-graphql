import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

export interface Paginator<Entity extends ObjectLiteral> {
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPage: number;
  };
  data: Array<Entity>;
}
