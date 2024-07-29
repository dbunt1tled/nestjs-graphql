import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { UsersFilter } from 'src/users/repository/users.filter';
import { Paginator } from 'src/core/repository/paginator';
import { UserCreateInput } from 'src/users/dto/user-create.input';
import { Role } from 'src/roles/entities/role.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  userList(): Promise<User[] | Paginator<User>> {
    return this.usersService.list(new UsersFilter());
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
