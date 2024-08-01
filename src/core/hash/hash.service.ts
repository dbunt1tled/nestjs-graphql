import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { User } from 'src/modules/users/entities/user.entity';
import { TokenType } from 'src/core/hash/enums/token.type';
import { ConfigService } from '@nestjs/config';
import { Tokens } from 'src/core/hash/dto/tokens';

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
          expiresIn: options?.accessExpiredSec || 60 * 30,
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
          expiresIn: options?.refreshExpiredSec || 60 * 60 * 24 * 30,
        },
      ),
    ]);
    return { accessToken: accessToken, refreshToken: refreshToken };
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
