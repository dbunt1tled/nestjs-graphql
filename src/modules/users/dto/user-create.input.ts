import { UserStatus } from 'src/modules/users/enum/user.status';
import { Field, InputType, Int } from '@nestjs/graphql';
import { Roles } from 'src/modules/roles/enum/roles';

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

  @Field({ nullable: true })
  confirmedAt?: Date;

  @Field(() => [String], { nullable: true })
  roles?: Roles[];
}
