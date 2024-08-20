import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/modules/users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import path from 'path';
import * as process from 'node:process';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from 'src/modules/roles/roles.module';
import { DateScalar } from 'src/core/utils/scalars/date.scalar';
import { HashModule } from 'src/core/hash/hash.module';
import { ExceptionHandler } from 'src/handler';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from 'src/modules/auth/auth.module';
import { JSONParseSafe } from 'src/core/utils';
import { FilesModule } from './modules/files/files.module';
import { UploadGraphQLScalar } from 'src/core/utils/scalars/upload.scalar';
import { ConfigApiModule } from 'src/core/config-api/config-api.module';
import { HashConfig } from 'src/core/config-api/hash.config';
import { MailModule } from 'src/modules/mail/mail.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      cache: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigApiModule],
      useFactory: (hashConfig: HashConfig) => ({
        privateKey: hashConfig.privateKey,
        publicKey: hashConfig.publicKey,
        signOptions: {
          algorithm: hashConfig.jwtAlgorithm,
        },
      }),
      inject: [HashConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
      debug: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
        numberScalarMode: 'integer',
      },
      context: ({ req, res }) => ({ req, res }),
      formatError: (err) => JSONParseSafe(err.message, true),
    }),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
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
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    UsersModule,
    RolesModule,
    HashModule,
    AuthModule,
    FilesModule,
    ConfigApiModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DateScalar,
    UploadGraphQLScalar,
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
  ],
})
export class AppModule {}
