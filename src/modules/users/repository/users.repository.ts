import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserCreateInput } from 'src/modules/users/dto/user-create.input';
import { uuid7 } from 'src/core/utils';
import { UserUpdateInput } from 'src/modules/users/dto/user-update.input';
import { NotFound } from 'src/core/exception/not-found';
import { UsersFilter } from 'src/modules/users/repository/users.filter';
import { Paginator } from 'src/core/repository/paginator';
import { RepositoryBase } from 'src/core/repository/repository.base';
import { HashService } from 'src/core/hash/hash.service';

@Injectable()
export class UsersRepository extends RepositoryBase<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    private readonly hashService: HashService,
  ) {
    super(repository);
  }

  async findById(id: string): Promise<User> {
    return this.repository.findOne({ where: { id } });
  }

  async getById(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFound(100001, `User not found`);
    }
    return user;
  }

  async new(user: UserCreateInput): Promise<User> {
    return await this.repository.save(
      this.repository.create({
        id: uuid7(),
        name: user.name,
        email: user.email,
        hash: await this.hashService.hash(user.password),
        status: user.status,
        confirmedAt: user.confirmedAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
  }

  async change(user: UserUpdateInput): Promise<User> {
    const u = await this.getById(user.id);

    return await this.repository.save({
      ...u,
      email: user.email ?? u.email,
      name: user.name ?? u.name,
      hash: user.password ? await this.hashService.hash(user.password) : u.hash,
      status: user.status ?? u.status,
      confirmedAt: user.confirmedAt ?? u.confirmedAt,
    });
  }

  async one(filter?: UsersFilter): Promise<User | null> {
    return this.resultOne(filter);
  }

  async list(filter?: UsersFilter): Promise<User[] | Paginator<User>> {
    return await this.resultList(filter);
  }
}
