import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFound } from 'src/core/exception/not-found';
import { Paginator } from 'src/core/repository/paginator';
import { RepositoryBase } from 'src/core/repository/repository.base';
import { Role } from 'src/roles/entities/role.entity';
import { RoleCreateInput } from 'src/roles/dto/role-create.input';
import { RolesFilter } from 'src/roles/repository/roles.filter';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

@Injectable()
export class RolesRepository extends RepositoryBase<Role> {
  constructor(
    @InjectRepository(Role)
    repository: Repository<Role>,
  ) {
    super(repository);
  }

  async findById(userId: string): Promise<Role> {
    return this.repository.findOne({ where: { user_id: userId } });
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
        user_id: role.userId,
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

  async remove(userId: string, role?: string): Promise<DeleteResult> {
    return await this.repository.delete({ user_id: userId });

    // const builder = this.repository
    //   .createQueryBuilder('roles')
    //   .restore()
    //   .where('roles.user_id - :email', { email: `%${query}%` })
    //   .execute();
  }
}
