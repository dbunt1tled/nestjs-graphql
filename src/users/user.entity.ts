import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UuidScalar } from 'src/core/utils/scalars/uuid.scalar';

@ObjectType()
export class User {
  @Field((type) => UuidScalar)
  id: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  name?: string;

  @Field((type) => Int)
  status: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
