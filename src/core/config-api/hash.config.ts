import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PathInfo } from 'src/core/config-api/dto/path-info.dto';
import path from 'path';
import { Algorithm } from 'jsonwebtoken';

@Injectable()
export class HashConfig {
  constructor(private configService: ConfigService) {}

  get publicKey(): string {
    return this.configService.getOrThrow('JWT_PUBLIC_KEY');
  }

  get privateKey(): string {
    return this.configService.getOrThrow('JWT_PRIVATE_KEY');
  }

  get jwtAlgorithm(): Algorithm {
    return this.configService.get<Algorithm>('JWT_TOKEN_ALGORITHM', 'RS256');
  }

  get tokenAccessLifeTime(): number {
    return parseInt(
      this.configService.getOrThrow('TOKEN_ACCESS_LIFE_TIME_SECONDS'),
    );
  }

  get tokenRefreshLifeTime(): number {
    return parseInt(
      this.configService.getOrThrow('TOKEN_REFRESH_LIFE_TIME_SECONDS'),
    );
  }
}
