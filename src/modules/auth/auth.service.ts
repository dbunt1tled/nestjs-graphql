import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersFilter } from 'src/modules/users/repository/users.filter';
import { NotFound } from 'src/core/exception/not-found';
import { HashService } from 'src/core/hash/hash.service';
import { SignUpInput } from 'src/modules/auth/dto/sign-up.input';
import { SignInResponse } from 'src/modules/auth/dto/sign-in.response';
import { UserStatus } from 'src/modules/users/enum/user.status';
import { SignInInput } from 'src/modules/auth/dto/sign-in.input';
import { SignUpResponse } from 'src/modules/auth/dto/sign-up.response';
import { TokenType } from 'src/core/hash/enums/token.type';
import { Unauthorized } from 'src/core/exception/unauthorized';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly usersService: UsersService,
  ) {}

  async signIn(signIn: SignInInput): Promise<SignInResponse> {
    let user = await this.validateCredentials(signIn.email, signIn.password);
    user = await this.usersService.change({
      id: user.id,
      session: this.hashService.random(16),
    });
    return await this.hashService.tokens(user);
  }

  async signUp(signUp: SignUpInput): Promise<SignUpResponse> {
    return <SignUpResponse>await this.usersService.new({
      name: signUp.name,
      email: signUp.email,
      password: signUp.password,
      status: UserStatus.PENDING,
    });
  }

  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.usersService.one(
      new UsersFilter({ filter: { email } }),
    );
    if (!user) {
      throw new NotFound(100003, `Email or password is incorrect`);
    }
    const pass = await this.hashService.compare(password, user.hash);
    if (!pass) {
      throw new NotFound(100004, `Email or password is incorrect`);
    }

    return user;
  }

  async getUserByAccessToken(
    accessToken: string,
    checkExpiry = true,
  ): Promise<User> {
    const token = await this.hashService.decode(accessToken, checkExpiry);

    if (token.type !== TokenType.ACCESS) {
      throw new Unauthorized(
        400003,
        `Your request was made with invalid credentials.`,
      );
    }

    const user = await this.usersService.getById(token.sub);
    if (!user) {
      throw new Unauthorized(
        400004,
        `Your request was made with invalid credentials.`,
      );
    }

    if (user.session === null || user.session !== token.session) {
      throw new Unauthorized(
        400005,
        `Your request was made with invalid credentials.`,
      );
    }

    return user;
  }
}
