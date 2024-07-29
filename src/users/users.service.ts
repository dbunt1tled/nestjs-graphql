import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Paginator } from 'src/core/repository/paginator';
import { UsersFilter } from 'src/users/repository/users.filter';
import { UsersRepository } from 'src/users/repository/users.repository';
import { UserUpdateInput } from 'src/users/dto/user-update.input';
import { UserCreateInput } from 'src/users/dto/user-create.input';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/entities/role.entity';
import { RolesFilter } from 'src/roles/repository/roles.filter';
import { isArray } from 'class-validator';
import { Roles } from 'src/roles/enum/roles';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesService: RolesService,
  ) {}

  async list(filter?: UsersFilter): Promise<User[] | Paginator<User>> {
    return await this.usersRepository.list(filter);
  }

  async one(filter?: UsersFilter): Promise<User | null> {
    return await this.usersRepository.one(filter);
  }

  async getById(id: string): Promise<User> {
    return await this.usersRepository.getById(id);
  }

  async new(user: UserCreateInput): Promise<User> {
    const u = await this.usersRepository.new(user);
    if (isArray(user.roles)) {
      await Promise.all(
        user.roles.map(async (role: Roles) => {
          await this.rolesService.new(
            {
              userId: u.id,
              role: role,
            },
            false,
          );
        }),
      );
    }

    return u;
  }

  async change(user: UserUpdateInput): Promise<User> {
    return await this.usersRepository.change(user);
  }

  async findById(id: string): Promise<User> {
    return await this.usersRepository.findById(id);
  }

  async roles(userId: string): Promise<Role[]> {
    return <Role[]>(
      await this.rolesService.list(new RolesFilter({ filter: { userId } }))
    );
  }
}
