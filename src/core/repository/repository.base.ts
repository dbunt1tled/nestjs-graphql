import { Filter } from 'src/core/repository/filter/filter';
import { Paginator } from 'src/core/repository/paginator';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { Repository } from 'typeorm';
import { NotFound } from 'src/core/exception/not-found';

export class RepositoryBase<Entity extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<Entity>) {}

  async resultOne(filter?: Filter): Promise<Entity | null> {
    if (filter === undefined || filter.options === undefined) {
      const u = await this.repository.find({ skip: 0, take: 1 });
      if (u.length === 0) {
        return null;
      }
      return u[0];
    }
    return this.repository.findOne(filter.build(1));
  }

  async resultOneOrFail(filter?: Filter): Promise<Entity> {
    const entity = await this.resultOne(filter);
    if (entity === null) {
      throw new NotFound(100000, `Entity not found`);
    }
    return entity;
  }

  async resultList(filter?: Filter): Promise<Entity[] | Paginator<Entity>> {
    if (
      filter === undefined ||
      filter.options === undefined ||
      !('pagination' in filter.options) ||
      filter.options.pagination === undefined ||
      filter.options.pagination.page === undefined
    ) {
      if (filter === undefined || filter.options === undefined) {
        return this.repository.find();
      }
      return this.repository.find(filter.build());
    }
    const filterData = filter.build();
    filterData.order = undefined;
    filterData.take = undefined;
    filterData.skip = undefined;

    const [data, count] = await Promise.all([
      this.repository.find(filter.build()),
      this.repository.count(filterData),
    ]);

    return <Paginator<Entity>>{
      data: data,
      included: {},
      meta: {
        total: data.length,
        page: filter.options.pagination.page,
        perPage: filter.options.pagination.limit,
        totalPage:
          count === 0 ? 1 : Math.ceil(count / filter.options.pagination.limit),
      },
    };
  }
}
