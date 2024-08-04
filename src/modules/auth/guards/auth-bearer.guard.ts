import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Unauthorized } from 'src/core/exception/unauthorized';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class AuthBearerGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const req = GqlExecutionContext.create(context).getContext().req;
    if (!req.headers.authorization) {
      throw new Unauthorized(400001, 'Unauthorized');
    }
    let user = null;
    try {
      user = await this.authService.getUserByAccessToken(
        req.headers.authorization.replace('Bearer ', ''),
      );
    } catch (e) {
      throw new Unauthorized(400002, 'Unauthorized');
    }
    req.authUser = user;
    return true;
  }
}
