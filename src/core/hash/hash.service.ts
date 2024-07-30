import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
  async compare(plainText: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, plainText);
  }

  async hash(plainText: string): Promise<string> {
    return await argon2.hash(plainText);
  }
}
