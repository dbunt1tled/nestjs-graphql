import { InputType, Field } from '@nestjs/graphql';
import { UuidScalar } from 'src/core/utils/scalars/uuid.scalar';
import { Roles } from 'src/roles/enum/roles';

@InputType()
export class RoleCreateInput {
  @Field(() => UuidScalar)
  userId: string;

  @Field()
  role: Roles;
}
