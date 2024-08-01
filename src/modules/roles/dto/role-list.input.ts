import { InputType, Field } from '@nestjs/graphql';
import { UuidScalar } from 'src/core/utils/scalars/uuid.scalar';

@InputType()
export class RoleListInput {
  @Field(() => UuidScalar)
  userId: string;

  @Field()
  role: string;
}
