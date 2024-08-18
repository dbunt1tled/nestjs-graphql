import { Log } from 'src/core/logger/log';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { durationToHuman, ip, uuid7 } from 'src/core/utils';
import qs from 'qs';
import { processRequest } from 'graphql-upload';

export const fastifyInstance = () => {
  const logger = new Log('main');
  const server = new FastifyAdapter({
    logger: false,
    disableRequestLogging: true,
    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
    bodyLimit: 26214400,
    querystringParser: (str) => qs.parse(str),
    genReqId: () => uuid7(),
  }).getInstance();

  server.addContentTypeParser(
    ['multipart/form-data', 'multipart'],
    function (req: any, reply, done) {
      req.isMultipart = true;
      done(null);
    },
  );

  server.addHook('preValidation', async function (req: any, reply) {
    if (!req.isMultipart) {
      return;
    }
    req.body = await processRequest(req.raw, reply.raw);
  });

  if (process.env.APP_DEBUG == 'true') {
    server.addHook('preHandler', (req, reply, done) => {
      const {
        method,
        routeOptions,
        body,
        query,
        headers,
        id,
        hostname,
        params,
      } = req;

      logger.log(
        JSON.stringify({
          type: 'Request Incoming',
          id,
          method,
          url: routeOptions.url,
          body,
          query,
          headers,
          ip: ip(req),
          hostname,
          params,
        }),
      );
      done();
    });

    server.addHook('onSend', (req, reply, payload, done) => {
      const headers = reply.getHeaders();
      if ((headers['content-type'] as string)?.includes('application/json')) {
        logger.log(
          JSON.stringify({
            type: 'Request answer',
            id: req.id,
            statusCode: reply.statusCode,
            responseTime: durationToHuman(reply.elapsedTime),
            payload: payload,
          }),
        );
      }

      done();
    });
  }

  process.on('SIGINT', () => {
    server.close(() => {
      console.log('Server has been shut down');
      process.exit(0);
    });
  });

  return server;
};
