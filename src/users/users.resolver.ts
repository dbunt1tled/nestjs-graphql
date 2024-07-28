import { Resolver, Query } from '@nestjs/graphql';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => [User])
  users(): Promise<User[]> {
    return this.usersService.list();
  }
}
