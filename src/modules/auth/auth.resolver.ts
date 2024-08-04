import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignInInput } from 'src/modules/auth/dto/sign-in.input';
import { AuthService } from 'src/modules/auth/auth.service';
import { SignInResponse } from 'src/modules/auth/dto/sign-in.response';
import { SignUpInput } from 'src/modules/auth/dto/sign-up.input';
import { SignUpResponse } from 'src/modules/auth/dto/sign-up.response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInResponse)
  async signIn(@Args('signIn') signIn: SignInInput): Promise<SignInResponse> {
    return this.authService.signIn(signIn);
  }

  @Mutation(() => SignUpResponse)
  async signUp(@Args('signUp') signUp: SignUpInput): Promise<SignUpResponse> {
    return this.authService.signUp(signUp);
  }
}
