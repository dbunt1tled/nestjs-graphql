import { UserStatus } from 'src/users/enum/user.status';
import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { Roles } from 'src/roles/enum/roles';
import { UsersFilter } from 'src/users/repository/users.filter';
import { SortOrder } from 'src/core/repository/sort.order';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class UserListInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field(() => [Int], { nullable: true })
  statuses?: UserStatus[];

  @Field(() => [String], { nullable: true })
  roles?: Roles[];

  @Field(() => Int)
  @Min(0)
  page: number = 0;

  @Field(() => Int)
  @Min(1)
  limit: number = 25;

  @Field(() => GraphQLJSONObject, { nullable: true })
  orderBy?: SortOrder;

  toFilter() {
    return new UsersFilter({
      filter: {
        nameFilter: this.name,
        emailFilter: this.email,
        status: this.statuses,
        role: this.roles,
      },
      sort: this.orderBy,
      pagination: {
        limit: this.limit,
        page: this.page,
      },
    });
  }
}
