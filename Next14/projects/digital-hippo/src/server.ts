import { req } from 'pino-std-serializers';
import { appRouter } from './trpc';
import payload from 'payload';
import { getPayloadClient } from './get-payload';
import { nextApp, nextHandler } from './next-utils';
import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

// start the server
const start = async () => {
  // get the payload client
  const payload = await getPayloadClient({
    //
    initOptions: {
      // set the express app
      express: app,
      // set the admin URL
      onInit: async (csm) => {
        csm.logger.info(`Admin URL: ${csm.getAdminURL()}`);
      },
    },
  });

  // add the trpc express middleware
  app.use(
    '/api/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // handle all requests with next.js
  app.use((req, resp) => nextHandler(req, resp));

  // prepare next.js
  nextApp.prepare().then(() => {
    payload.logger.info(`Next.js server started on port ${PORT}`);

    app.listen(PORT, async () => {
      payload.logger.info(
        `Next App URL ${process.env.NEXT_PUBLIC_URL}`,
      );
    });
  });
};

start();