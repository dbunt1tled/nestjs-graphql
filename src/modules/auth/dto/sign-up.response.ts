import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UuidScalar } from 'src/core/utils/scalars/uuid.scalar';
import { UserStatus } from 'src/modules/users/enum/user.status';
import { Role } from 'src/modules/roles/entities/role.entity';

@ObjectType()
export class SignUpResponse {
  @Field(() => UuidScalar)
  id: string;

  @Field()
  email: string;

  @Field()
  hash: string;

  @Field()
  name: string;

  @Field(() => Int)
  status: UserStatus;

  @Field({ nullable: true })
  confirmedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Role], { nullable: true })
  roles?: Role[];
}
