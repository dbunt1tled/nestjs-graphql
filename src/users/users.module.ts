import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { DateScalar } from 'src/core/utils/scalars/date.scalar';

@Module({
  providers: [UsersService, UsersResolver, DateScalar],
})
export class UsersModule {}
