import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import path from 'path';
import * as process from 'node:process';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from 'src/roles/roles.module';
import { DateScalar } from 'src/core/utils/scalars/date.scalar';
import { HashModule } from 'src/core/hash/hash.module';
import { ExceptionHandler } from 'src/handler';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from 'src/modules/auth/auth.module';

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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
      debug: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
        numberScalarMode: 'integer',
      },
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DateScalar,
    // {
    //   provide: APP_FILTER,
    //   useClass: ExceptionHandler,
    // },
  ],
})
export class AppModule {}
