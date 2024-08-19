import { SetMetadata } from '@nestjs/common';
import { TokenType } from 'src/core/hash/enums/token.type';

export const TokenCheck = (token: TokenType) =>
  SetMetadata('tokenCheck', token);
