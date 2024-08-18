import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/modules/users/users.module';
import * as process from 'node:process';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from 'src/modules/roles/roles.module';
import { TestCommand } from 'src/commands/test.command';
import { HashModule } from './core/hash/hash.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { Algorithm } from 'jsonwebtoken';
import { FilesModule } from './modules/files/files.module';
import { ConfigApiModule } from './core/config-api/config-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      cache: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.get<string>('JWT_PRIVATE_KEY', ''),
        publicKey: configService.get<string>('JWT_PUBLIC_KEY', ''),
        signOptions: {
          algorithm: configService.get<Algorithm>(
            'JWT_TOKEN_ALGORITHM',
            'RS256',
          ),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      migrationsTableName: 'migrations',
      autoLoadEntities: true,
      logging: process.env.NODE_ENV !== 'production',
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    UsersModule,
    RolesModule,
    HashModule,
    AuthModule,
    FilesModule,
    ConfigApiModule,
  ],
  controllers: [AppController],
  providers: [AppService, TestCommand],
})
export class AppCliModule {}
