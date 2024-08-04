import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignInResponse {
  @Field()
  tokenAccess: string;

  @Field()
  tokenAccessExpires: Date;

  @Field()
  tokenRefresh: string;

  @Field()
  tokenRefreshExpires: Date;
}
