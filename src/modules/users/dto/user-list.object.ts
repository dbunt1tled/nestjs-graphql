import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Paginator } from 'src/core/repository/paginator';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
class PageMeta {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  totalPage: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  perPage: number;
}

@ObjectType()
export class UserListObject implements Paginator<User> {
  @Field(() => [User])
  data: User[];
  @Field(() => PageMeta)
  meta: PageMeta;
}
