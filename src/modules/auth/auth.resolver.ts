import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignInInput } from 'src/modules/auth/dto/sign-in.input';
import { AuthService } from 'src/modules/auth/auth.service';
import { SignInResponse } from 'src/modules/auth/dto/sign-in.response';
import { SignUpInput } from 'src/modules/auth/dto/sign-up.input';
import { SignUpResponse } from 'src/modules/auth/dto/sign-up.response';
import { UseGuards } from '@nestjs/common';
import { AuthBearerGuard } from 'src/modules/auth/guards/auth-bearer.guard';
import { TokenCheck } from 'src/modules/auth/decorators/token-check.decorator';
import { TokenType } from 'src/core/hash/enums/token.type';
import { AuthUser } from 'src/core/decorator/auth.user.decorator';
import { User } from 'src/modules/users/entities/user.entity';

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

  @UseGuards(AuthBearerGuard)
  @TokenCheck(TokenType.REFRESH)
  @Mutation(() => SignInResponse)
  async refreshToken(@AuthUser() user: User): Promise<SignInResponse> {
    return this.authService.refreshToken(user);
  }
}
