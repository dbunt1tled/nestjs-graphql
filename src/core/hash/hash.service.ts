import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { User } from 'src/modules/users/entities/user.entity';
import { TokenType } from 'src/core/hash/enums/token.type';
import { ConfigService } from '@nestjs/config';
import { Tokens } from 'src/core/hash/dto/tokens';
import { DateTime } from 'luxon';
import { Unprocessable } from 'src/core/exception/unprocessable';

@Injectable()
export class HashService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async compare(plainText: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, plainText);
  }

  async hash(plainText: string): Promise<string> {
    return await argon2.hash(plainText);
  }

  async tokens(
    user: User,
    options?: { accessExpiredSec?: number; refreshExpiredSec?: number },
  ): Promise<Tokens> {
    const accessExpiredSec =
      options?.accessExpiredSec ||
      parseInt(this.configService.get('TOKEN_ACCESS_LIFE_TIME_SECONDS'));
    const refreshExpiredSec =
      options?.refreshExpiredSec ||
      parseInt(this.configService.get('TOKEN_REFRESH_LIFE_TIME_SECONDS'));
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          type: TokenType.ACCESS,
          role: user.roles,
          session: user.session,
        },
        {
          expiresIn: accessExpiredSec,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          type: TokenType.ACCESS,
          role: user.roles,
          session: user.session,
        },
        {
          expiresIn: refreshExpiredSec,
        },
      ),
    ]);
    return {
      tokenAccess: accessToken,
      tokenAccessExpires: DateTime.now()
        .plus({ second: accessExpiredSec })
        .toJSDate(),
      tokenRefresh: refreshToken,
      tokenRefreshExpires: DateTime.now()
        .plus({ second: refreshExpiredSec })
        .toJSDate(),
    };
  }

  async decode(token: string, checkExpiry = true) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      if (!checkExpiry && e instanceof TokenExpiredError) {
        return await this.jwtService.decode(token);
      }
      throw e;
    }
  }
}
