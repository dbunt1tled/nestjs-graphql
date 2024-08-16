import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/modules/users/entities/user.entity';
import { Paginator } from 'src/core/repository/paginator';
import { UserCreateInput } from 'src/modules/users/dto/user-create.input';
import { Role } from 'src/modules/roles/entities/role.entity';
import { UserListInput } from 'src/modules/users/dto/user-list.input';
import { UserListObject } from 'src/modules/users/dto/user-list.object';
import { UseGuards } from '@nestjs/common';
import { AuthBearerGuard } from 'src/modules/auth/guards/auth-bearer.guard';
import { UsersFilter } from 'src/modules/users/repository/users.filter';
import { NotFound } from 'src/core/exception/not-found';
import { AuthUser } from 'src/core/decorator/auth.user.decorator';

@UseGuards(AuthBearerGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserListObject)
  async userList(@Args('req') req: UserListInput, @AuthUser() user: User) {
    console.log(user);
    return (await this.usersService.list(req.toFilter())) as Paginator<User>;
  }

  @Query(() => User)
  userOne(@Args('id') id: string): Promise<User> {
    return this.usersService.getById(id);
  }

  @Mutation(() => User)
  async userCreate(@Args('user') user: UserCreateInput): Promise<User> {
    const u = await this.usersService.one(
      new UsersFilter({ filter: { email: user.email } }),
    );
    if (u) {
      throw new NotFound(100006, `Email already exists`);
    }

    return this.usersService.new(user);
  }

  @ResolveField(() => [Role])
  roles(@Parent() user: User): Promise<Role[]> {
    if (user.roles) {
      return Promise.resolve(user.roles);
    }
    return this.usersService.roles(user.id);
  }
}
