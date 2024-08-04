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

@UseGuards(AuthBearerGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserListObject)
  async userList(@Args('req') req: UserListInput) {
    return (await this.usersService.list(req.toFilter())) as Paginator<User>;
  }

  @Query(() => User)
  userOne(@Args('id') id: string): Promise<User> {
    return this.usersService.getById(id);
  }

  @Mutation(() => User)
  userCreate(@Args('user') user: UserCreateInput): Promise<User> {
    return this.usersService.new(user);
  }

  @ResolveField(() => [Role])
  roles(@Parent() user: User): Promise<Role[]> {
    return this.usersService.roles(user.id);
  }
}
