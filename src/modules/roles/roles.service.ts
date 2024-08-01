import { Injectable } from '@nestjs/common';
import { Paginator } from 'src/core/repository/paginator';
import { RolesFilter } from 'src/modules/roles/repository/roles.filter';
import { Role } from 'src/modules/roles/entities/role.entity';
import { RoleCreateInput } from 'src/modules/roles/dto/role-create.input';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { RolesRepository } from 'src/modules/roles/repository/roles.repository';
import { Roles } from 'src/modules/roles/enum/roles';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RolesRepository) {}

  async list(filter: RolesFilter): Promise<Role[] | Paginator<Role>> {
    return await this.roleRepository.list(filter);
  }

  async one(filter: RolesFilter): Promise<Role | null> {
    return await this.roleRepository.one(filter);
  }

  async getById(id: string): Promise<Role> {
    return await this.roleRepository.getById(id);
  }

  async new(
    role: RoleCreateInput,
    returnEntity: boolean = true,
  ): Promise<Role> {
    return await this.roleRepository.new(role, returnEntity);
  }

  async findById(id: string): Promise<Role> {
    return await this.roleRepository.findById(id);
  }

  async remove(userId: string, role?: Roles): Promise<DeleteResult> {
    return await this.roleRepository.remove(userId, role);
  }
}
