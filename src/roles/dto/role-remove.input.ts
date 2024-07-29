import { InputType, Field } from '@nestjs/graphql';
import { UuidScalar } from 'src/core/utils/scalars/uuid.scalar';
import { Roles } from 'src/roles/enum/roles';

@InputType()
export class RoleRemoveInput {
  @Field(() => UuidScalar)
  userId: string;

  @Field({ nullable: true })
  role?: Roles;
}
