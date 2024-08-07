import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { Paginator } from 'src/core/repository/paginator';
import { UsersFilter } from 'src/modules/users/repository/users.filter';
import { UsersRepository } from 'src/modules/users/repository/users.repository';
import { UserUpdateInput } from 'src/modules/users/dto/user-update.input';
import { UserCreateInput } from 'src/modules/users/dto/user-create.input';
import { RolesService } from 'src/modules/roles/roles.service';
import { Role } from 'src/modules/roles/entities/role.entity';
import { RolesFilter } from 'src/modules/roles/repository/roles.filter';
import { isArray } from 'class-validator';
import { Roles } from 'src/modules/roles/enum/roles';
import { HashService } from 'src/core/hash/hash.service';
import { NotFound } from 'src/core/exception/not-found';

@Injectable()
export class UsersService {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
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
    const u = await this.usersRepository.new({
      ...user,
      password: await this.hashService.hash(user.password),
    });
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
    const u = await this.usersRepository.change({
      ...user,
      password:
        user.password !== undefined
          ? await this.hashService.hash(user.password)
          : undefined,
    });
    if (isArray(user.roles)) {
      await this.rolesService.remove(u.id);
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

  async findById(id: string): Promise<User> {
    return await this.usersRepository.findById(id);
  }

  async roles(userId: string): Promise<Role[]> {
    return <Role[]>(
      await this.rolesService.list(new RolesFilter({ filter: { userId } }))
    );
  }
}
