import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { User } from 'src/modules/users/entities/user.entity';
import { TokenType } from 'src/core/hash/enums/token.type';
import { Tokens } from 'src/core/hash/dto/tokens';
import { DateTime } from 'luxon';
import { random, uuid7 } from 'src/core/utils';
import { HashConfig } from 'src/core/config-api/hash.config';

@Injectable()
export class HashService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashConfig: HashConfig,
  ) {}
  async compare(plainText: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, plainText);
  }

  async hash(plainText: string): Promise<string> {
    return await argon2.hash(plainText);
  }

  random(size: number = 32): string {
    return random(size);
  }

  uuid7(): string {
    return uuid7();
  }

  async confirmEmailToken(
    user: User,
    options?: { expiredSec?: number },
  ): Promise<string> {
    const expiredSec =
      options?.expiredSec || this.hashConfig.tokenConfirmEmailLifeTime;

    return await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        type: TokenType.CONFIRM_EMAIL,
        session: user.session,
      },
      {
        expiresIn: expiredSec,
      },
    );
  }

  async tokens(
    user: User,
    options?: { accessExpiredSec?: number; refreshExpiredSec?: number },
  ): Promise<Tokens> {
    const accessExpiredSec =
      options?.accessExpiredSec || this.hashConfig.tokenAccessLifeTime;
    const refreshExpiredSec =
      options?.refreshExpiredSec || this.hashConfig.tokenRefreshLifeTime;
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
          type: TokenType.REFRESH,
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
