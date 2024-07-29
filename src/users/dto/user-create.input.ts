import { UserStatus } from 'src/users/enum/user.status';
import { Field, InputType, Int } from '@nestjs/graphql';
import { Roles } from 'src/roles/enum/roles';

@InputType()
export class UserCreateInput {
  @Field({ nullable: true })
  name?: string;
  @Field()
  email: string;
  @Field({ nullable: true })
  password?: string;
  @Field(() => Int)
  status: UserStatus;
  @Field(() => [String], { nullable: true })
  roles?: Roles[];
}
