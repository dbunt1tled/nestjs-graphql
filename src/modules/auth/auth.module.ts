import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersService } from 'src/modules/users/users.service';
import { HashService } from 'src/core/hash/hash.service';
import { RolesService } from 'src/modules/roles/roles.service';
import { UsersModule } from 'src/modules/users/users.module';
import { MailService } from 'src/modules/mail/mail.service';

@Global()
@Module({
  imports: [UsersModule],
  providers: [AuthService, AuthResolver, MailService, HashService],
  exports: [AuthService],
})
export class AuthModule {}
