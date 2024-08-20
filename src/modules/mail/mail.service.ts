import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { HashService } from 'src/core/hash/hash.service';
import { MailerService } from '@nestjs-modules/mailer';
import path from 'path';
import { MailConfig } from 'src/core/config-api/mail.config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailConfig: MailConfig,
    private readonly hashService: HashService,
    private readonly mailerService: MailerService,
  ) {}
  async confirmUser(user: User, options?: { expiredSec?: number }) {
    const token = await this.hashService.confirmEmailToken(user, options);

    return this.sendWithTemplate(
      user.email,
      'Confirm your email account',
      path.join('auth', 'confirmUserEmail'),
      {
        baseUrl: this.mailConfig.fromFrontendUrl,
        name: user.name,
        urlConfirmAddress: `${this.mailConfig.fromFrontendUrl}/auth/confirm/${token}`,
      },
    );
  }

  private async sendWithTemplate(
    to: string,
    subject: string,
    template: string,
    context: object,
  ): Promise<any> {
    return await this.mailerService.sendMail({
      to: to,
      subject: subject,
      template: template,
      context: context,
    });
  }
}
