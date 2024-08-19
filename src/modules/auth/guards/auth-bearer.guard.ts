import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Unauthorized } from 'src/core/exception/unauthorized';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from 'src/modules/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { TokenType } from 'src/core/hash/enums/token.type';

@Injectable()
export class AuthBearerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = GqlExecutionContext.create(context).getContext().req;
    if (!req.headers.authorization) {
      throw new Unauthorized(400001, 'Unauthorized');
    }
    let user = null;
    let tokenType = this.reflector.get('tokenCheck', context.getHandler());
    if (!tokenType) {
      tokenType = TokenType.ACCESS;
    }
    try {
      user = await this.authService.getUserByToken(
        req.headers.authorization.replace('Bearer ', ''),
        tokenType,
      );
    } catch (e) {
      throw new Unauthorized(400002, 'Unauthorized');
    }
    req.authUser = user;
    return true;
  }
}
