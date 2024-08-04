import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  ExceptionFilter,
  ContextType,
} from '@nestjs/common';
import { Log } from 'src/core/logger/log';
import { FastifyRequest } from 'fastify';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseException } from 'src/core/exception/base-exception';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';

@Catch()
export class ExceptionHandler implements ExceptionFilter, GqlExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    let req = null;
    let ctx = null;
    if (host.getType() as ContextType | 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      ctx = gqlHost.getContext();
      req = <FastifyRequest>ctx.req;
    } else {
      ctx = host.switchToHttp();
      req = <FastifyRequest>ctx.getRequest();
    }
    const logger: Log = new Log('general');
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const code = exception instanceof BaseException ? exception.code : 0;
    const response =
      exception instanceof HttpException
        ? { errors: exception.getResponse() }
        : exception instanceof Error
          ? { errors: exception.message }
          : { errors: 'Internal Server Error' };

    const debug =
      exception instanceof Error && process.env.NODE_ENV !== 'production'
        ? {
            file: exception.stack.split('\n')[1]?.trim(),
            trace: exception.stack,
          }
        : {};
    const responseBody = {
      ...(response as NonNullable<unknown>),
      ...{
        code: code,
        statusCode: httpStatus,
        path: req.url,
      },
      ...debug,
    };
    await logger.errorException({
      statusCode: httpStatus,
      method: req.method,
      path: req.url,
      message: response.errors,
      trace: debug.trace,
      request: {
        id: req.id,
        hostname: req.hostname,
        headers: <object | string>req.headers,
        params: <object | string>req.params,
        body: <object | string>req.body,
        query: <object | string>req.query,
      },
    });
    if (host.getType() as ContextType | 'graphql') {
      return new Error(JSON.stringify(responseBody));
    }
    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
