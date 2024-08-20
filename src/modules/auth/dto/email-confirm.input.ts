import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsStrongPassword, IsEmail, Length } from 'class-validator';

@InputType()
export class EmailConfirmInput {
  @Field()
  token: string;
}
