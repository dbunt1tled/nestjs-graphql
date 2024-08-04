import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsStrongPassword, IsEmail, Length } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @Length(3, 60)
  name: string;

  @Field()
  @IsString()
  @Length(5, 60)
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @Length(6, 70)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
