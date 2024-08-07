import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFound } from 'src/core/exception/not-found';
import { Paginator } from 'src/core/repository/paginator';
import { RepositoryBase } from 'src/core/repository/repository.base';
import { Role } from 'src/modules/roles/entities/role.entity';
import { RoleCreateInput } from 'src/modules/roles/dto/role-create.input';
import { RolesFilter } from 'src/modules/roles/repository/roles.filter';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { Roles } from 'src/modules/roles/enum/roles';

@Injectable()
export class RolesRepository extends RepositoryBase<Role> {
  constructor(
    @InjectRepository(Role)
    repository: Repository<Role>,
  ) {
    super(repository);
  }

  async findById(userId: string): Promise<Role> {
    return this.repository.findOne({ where: { userId: userId } });
  }

  async getById(userId: string): Promise<Role> {
    const role = await this.findById(userId);
    if (!role) {
      throw new NotFound(100002, `Role not found`);
    }
    return role;
  }

  async new(
    role: RoleCreateInput,
    returnEntity: boolean = true,
  ): Promise<Promise<Role> | Promise<null>> {
    await this.repository.insert(
      this.repository.create({
        userId: role.userId,
        role: role.role,
        createdAt: new Date(),
      }),
    );
    if (returnEntity) {
      return this.resultOneOrFail(
        new RolesFilter({ filter: { userId: role.userId, role: role.role } }),
      );
    }
  }

  async one(filter?: RolesFilter): Promise<Role | null> {
    return this.resultOne(filter);
  }

  async list(filter?: RolesFilter): Promise<Role[] | Paginator<Role>> {
    return await this.resultList(filter);
  }

  async remove(userId: string, role?: Roles): Promise<DeleteResult> {
    const builder = this.repository
      .createQueryBuilder()
      .restore()
      .where('userId = :userId', { userId: userId });
    if (role) {
      builder.andWhere('role = :role', { role });
    }
    return await builder.execute();
  }
}
