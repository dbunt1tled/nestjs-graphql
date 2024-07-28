import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class UsersService {
  async list(): Promise<User[]> {
    const user = new User();
    user.id = '91e621fb-638b-4848-8d47-4d7245e4e071';
    user.email = 'jg5pN@example.com';
    user.password = '1234';
    user.name = 'test';
    user.status = 1;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return [user];
  }
}
