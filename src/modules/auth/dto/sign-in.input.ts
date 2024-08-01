import { Field, InputType } from '@nestjs/graphql';
import { IsString, isStrongPassword, Length } from 'class-validator';

@InputType()
export class SignInInput {
  @Field()
  @IsString()
  @Length(5, 60)
  email: string;
  @Field()
  @IsString()
  @Length(6, 70)
  @isStrongPassword()
  password: string;
}
