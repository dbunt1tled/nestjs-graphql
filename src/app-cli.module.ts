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
        secret: configService.get('JWT_KEY'),
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
  ],
  controllers: [AppController],
  providers: [AppService, TestCommand],
})
export class AppCliModule {}
